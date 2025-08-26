import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase配置检查:');
console.log('URL:', supabaseUrl);
console.log('Key存在:', !!supabaseAnonKey);
console.log('Key长度:', supabaseAnonKey?.length || 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase配置缺失!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY存在:', !!supabaseAnonKey);
  
  // 创建一个模拟客户端以避免应用崩溃
  export const supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase未正确配置' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase未正确配置' } }),
    }),
    supabaseUrl: supabaseUrl || 'NOT_CONFIGURED',
    supabaseKey: !!supabaseAnonKey
  };
} else {
  // 创建真实的Supabase客户端
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
  
  // 添加调试属性
  supabase.supabaseUrl = supabaseUrl;
  supabase.supabaseKey = true;
  
  console.log('Supabase客户端创建成功');
}