const SUPER_SECRET_REVALIDATION_KEY = "super_secret"; // obviously you wouldn't want this in your code

export default async function handler(req, res) {
    const { handle, secret } = req.query;
  if (secret !== SUPER_SECRET_REVALIDATION_KEY) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.unstable_revalidate(`/products/${handle}`)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}