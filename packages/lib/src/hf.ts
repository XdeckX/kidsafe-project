export async function getEmbedding(text: string): Promise<number[]> {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) throw new Error('Hugging Face token not found');
  
  const response = await fetch(
    'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text.substring(0, 8000) })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${await response.text()}`);
  }
  
  return await response.json();
}
