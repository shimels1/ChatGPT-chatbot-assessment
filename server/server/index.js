const express = require("express");
const app = express();

const { Configuration, OpenAIApi } = require("openai"); 

const configuration = new Configuration({
  apiKey: "key",
});

const openai = new OpenAIApi(configuration);

const allowCors = function (req, res, next) {
 
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept, Authorization');
  next();
}

app.use(express.json());
app.use("/", allowCors);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { prompt } = req.body;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000, 
      top_p: 1, 
      frequency_penalty: 0.5, 
      presence_penalty: 0,
    });

    res.status(200).send({
      message: response.data.choices[0].text,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(3000, () => console.log('server is running on port http://localhost:3000'));
