export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ authorized: true });
  } else {
    res.status(401).json({ authorized: false });
  }
}
