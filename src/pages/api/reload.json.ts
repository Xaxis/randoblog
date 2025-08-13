import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  try {
    // Force a content reload by updating the config file timestamp
    const configPath = './src/content/config.ts';
    const fs = await import('fs');
    
    // Read the current config
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update the cache busting parameter
    const currentTime = Date.now();
    const randomValue = Math.random();
    
    // Replace cache busting parameters with new values
    configContent = configContent.replace(
      /v=\d+&r=[\d.]+/g, 
      `v=${currentTime}&r=${randomValue}`
    );
    
    // If no cache busting found, add it
    if (!configContent.includes('v=') || !configContent.includes('r=')) {
      configContent = configContent.replace(
        /\$\{Date\.now\(\)\}/g,
        `\${Date.now()}&v=${currentTime}&r=${randomValue}`
      );
    }
    
    // Write the updated config back
    fs.writeFileSync(configPath, configContent);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Content reload triggered',
      timestamp: currentTime
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error reloading content:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to reload content'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Use POST to reload content',
    usage: 'curl -X POST http://localhost:4322/randoblog/api/reload.json'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
