const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// התחברות ל-Gemini בעזרת המפתח שיוגדר בשרת
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.all('/voice', async (req, res) => {
  // קבלת הטקסט שהמתקשר אמר מפרמטר ה-API של ימות המשיח
  const userText = req.query.ApiText || req.body.ApiText || 'שלום';

  try {
    // שליחת הבקשה ל-Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userText,
      config: {
        systemInstruction: 'אתה עוזר קולי בטלפון. ענה בקצרה ובבהירות, במשפט אחד או שניים בלבד, ללא תווים מיוחדים או עיצוב.'
      }
    });

    // ניקוי תווים שעלולים להפריע להקראה הטלפונית
    const cleanText = response.text.replace(/[*#\n]/g, ' ');

    // מחזירים פקודה לימות המשיח: הקראת התשובה + בקשת קלט קולי נוסף
    res.send(`id_list_message=t-${cleanText}&read=t-נא לדבר לאחר הצפצוף=val,1,1,7,7,Hebrew,no,no,no`);
  } catch (error) {
    console.error('Error:', error);
    res.send('id_list_message=t-ארעה שגיאה בעבוד הנתונים');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
