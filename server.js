const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.all('/voice', async (req, res) => {
  const userText = req.query.ApiText || req.body.ApiText || 'שלום';

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: 'אתה עוזר קולי בטלפון. ענה בקצרה ובבהירות, במשפט אחד או שניים בלבד, ללא תווים מיוחדים או עיצוב.'
    });

    const result = await model.generateContent(userText);
    const responseText = result.response.text();

    const cleanText = responseText.replace(/[*#\n]/g, ' ');

    res.send(`id_list_message=t-${cleanText}&read=t-נא לדבר לאחר הצפצוף=val,1,1,7,7,Hebrew,no,no,no`);
  } catch (error) {
    console.error('Error:', error);
    res.send('id_list_message=t-ארעה שגיאה בעבוד הנתונים');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
