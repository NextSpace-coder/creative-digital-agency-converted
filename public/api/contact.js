// API endpoint for contact form submissions
// This is a mock API endpoint - replace with your actual backend

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const formData = req.body;
    
    console.log('Received contact form submission:', formData);
    
    // Here you would typically:
    // 1. Validate the data
    // 2. Save to database
    // 3. Send email notification
    // 4. Return success response
    
    // Mock validation
    if (!formData.name || !formData.email || !formData.message) {
      res.status(400).json({ 
        error: 'Missing required fields',
        message: '请填写所有必填字段' 
      });
      return;
    }

    // Mock successful response
    res.status(200).json({
      success: true,
      message: '表单提交成功',
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: '服务器内部错误，请稍后重试' 
    });
  }
}