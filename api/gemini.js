export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { model, contents, generationConfig } = req.body;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig })
    }
  );

  const data = await response.json();
  res.status(response.status).json(data);
}
