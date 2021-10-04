const commander = require("commander");
const dasha = require("@dasha.ai/sdk");

commander
  .command("out")
  .description("check calls from Dasha")
  .requiredOption("-p --phone <phone>", "phone or SIP URI to call to")
  .option("-c --config <name>", "SIP config name", "default")
  .action(async ({ phone, config }) => {
    const app = await dasha.deploy("./app");

    app.connectionProvider = () => dasha.sip.connect(new dasha.sip.Endpoint(config));
    app.ttsDispatcher = () => "dasha";

    app.setExternal("checkPin", ({ pin }) => pin.includes("1"));

    await app.start();

    const conv = app.createConversation({ phone });
    const result = await conv.execute();
    console.log(`pin is ${result.output.pincode}`);

    await app.stop();
    app.dispose();
  });

commander
  .command("in")
  .description("check calls to Dasha")
  .action(async () => {
    const app = await dasha.deploy("./app");

    app.connectionProvider = () => dasha.sip.connect(new dasha.sip.Endpoint("default"));
    app.ttsDispatcher = () => "dasha";

    app.setExternal("checkPin", ({ pin }) => pin.includes("1"));

    app.queue.on("ready", async (conv) => {
      conv.input = { phone: null };
      
    const result = await conv.execute({
      channel: conv.input.phone === "chat" ? "text" : "audio",
  });

      console.log(`pin is ${result.output.pincode}`);

      await app.stop();
      app.dispose();
    });

    await app.start();

    console.log("Waiting for calls via SIP");
    console.log("Press Ctrl+C to exit");
    console.log("More details: https://docs.dasha.ai/en-us/default/tutorials/sip-inbound-calls/");
    console.log("Or just type:");
    console.log("dasha sip create-inbound --application-name dtmf-test-app dtmf-test-app");
    console.log("And call to sip uri returned by command above");
  });

commander.parseAsync();
