const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const genAI = new GoogleGenerativeAI("AIzaSyAIAOvbbuQw52MxUii9Ov3JxslKpNN3Eok");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent("Hola");
        const response = await result.response;
        console.log("Success:", response.text());
    } catch (err) {
        console.error("Error testing Gemini Key:", err.message);
    }
}

test();
