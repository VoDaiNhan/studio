'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Files, ShieldQuestion, Phone, LayoutDashboard, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

function AiLogo() {
    return (
        <svg height="40" viewBox="0 0 81 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-auto">
            <path d="M33.568 56.216L24.8 79.024C24.8 79.024 21.2 80.224 19.448 78.472C17.696 76.72 18.896 73.12 18.896 73.12L27.472 50.8C27.472 50.8 30.68 50.152 32.24 51.944C33.8 53.736 33.568 56.216 33.568 56.216Z" fill="url(#paint0_linear_1_2)"/>
            <path d="M54.12 73.12L62.696 50.8C62.696 50.8 65.904 50.152 67.464 51.944C69.024 53.736 68.792 56.216 68.792 56.216L60.024 79.024C60.024 79.024 56.424 80.224 54.672 78.472C52.92 76.72 54.12 73.12 54.12 73.12Z" fill="url(#paint1_linear_1_2)"/>
            <path d="M46.736 0.943999L36.8 28.144L28.856 25.168L30.416 20.272L18.464 23.008L14.72 34.288L2.144 37.888L11.024 59.488L21.376 56.032L22.048 53.872L14.936 56.216L7.304 39.424L18.064 36.216L21.808 24.936L32.24 22.2L30.68 27.096L39.824 29.832L49.752 2.63199C49.752 2.63199 51.08 -0.424001 48.736 0.111999C46.392 0.647999 46.736 0.943999 46.736 0.943999Z" fill="url(#paint2_linear_1_2)"/>
            <path d="M46.736 0.943999L36.8 28.144L28.856 25.168L30.416 20.272L18.464 23.008L14.72 34.288L2.144 37.888L11.024 59.488L21.376 56.032L22.048 53.872L14.936 56.216L7.304 39.424L18.064 36.216L21.808 24.936L32.24 22.2L30.68 27.096L39.824 29.832L49.752 2.63199C49.752 2.63199 51.08 -0.424001 48.736 0.111999C46.392 0.647999 46.736 0.943999 46.736 0.943999Z" fill="url(#paint3_linear_1_2)" fillOpacity="0.2"/>
            <path d="M37.8631 34.823L47.5351 6.82299C47.5351 6.82299 43.7431 3.55899 41.5351 5.35899C39.3271 7.15899 39.4151 10.279 39.4151 10.279L30.6871 31.879L37.8631 34.823Z" fill="url(#paint4_linear_1_2)"/>
            <defs>
                <linearGradient id="paint0_linear_1_2" x1="26.336" y1="50.2" x2="26.336" y2="79.6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00BAF4"/>
                <stop offset="1" stopColor="#0058F9"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_2" x1="61.536" y1="50.2" x2="61.536" y2="79.6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00E5E5"/>
                <stop offset="1" stopColor="#00A2F9"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_2" x1="26.336" y1="0" x2="26.336" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00BAF4"/>
                <stop offset="1" stopColor="#0058F9"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1_2" x1="25.948" y1="0.5" x2="25.948" y2="59.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint4_linear_1_2" x1="39.6151" y1="5.19999" x2="39.6151" y2="35.4" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00E5E5"/>
                <stop offset="1" stopColor="#00A2F9"/>
                </linearGradient>
            </defs>
        </svg>
    )
}

export function ChatSidebar() {
  const router = useRouter();
  const { role } = useUser();

  const handleNewChat = () => {
    router.push('/chat');
    router.refresh();
  };

  const isAdmin = role === 'admin';

  return (
    <aside className="w-64 flex-shrink-0 bg-white p-4 flex flex-col justify-between">
        <div>
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => router.push('/chat')}>
                <AiLogo />
                <div className='flex flex-col'>
                    <span className="text-xl font-bold text-blue-600">TRA CỨU</span>
                    <span className="text-xl font-bold text-gray-700 -mt-2">LUẬT</span>
                </div>
            </div>

            <Button 
                className="w-full justify-start text-base font-normal bg-blue-50 text-gray-700 hover:bg-blue-100 rounded-xl mb-6"
                onClick={handleNewChat}
            >
                <Plus className="mr-2 h-5 w-5" />
                Cuộc trò chuyện mới
            </Button>

            <nav className="space-y-4">
                {isAdmin && (
                    <div 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push('/dashboard')}
                    >
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <LayoutDashboard className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-800">Dashboard Admin</h3>
                            <Badge variant="secondary" className="text-xs mt-1">Quản trị</Badge>
                        </div>
                    </div>
                )}

                <div 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push('/chat')}
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800">Văn bản Pháp Luật</h3>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push('/lookup');
                            }} 
                            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                        >
                            <span className="text-xs">···</span>
                            <span>Tra cứu Văn bản</span>
                        </button>
                    </div>
                </div>

                <div 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push('/templates')}
                >
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Files className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800">Mẫu đơn pháp lý</h3>
                    </div>
                </div>

                {!isAdmin && (
                    <div 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push('/settings')}
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Settings className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-800">Cài đặt</h3>
                        </div>
                    </div>
                )}

                <div 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => alert('Liên hệ: support@tracuuluat.vn')}
                >
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShieldQuestion className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800">Hỗ trợ</h3>
                    </div>
                </div>
            </nav>
        </div>

        <div className="border-t pt-4">
            <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700">
                <Phone className="mr-2 h-4 w-4" />
                Hotline: 19005001
            </Button>
            <div className="text-center text-xs text-gray-400 mt-4">
                <p>Một sản phẩm của</p>
                <p className="font-semibold">VIỆN CÔNG NGHỆ BLOCKCHAIN VÀ TRÍ TUỆ NHÂN TẠO ABAII</p>
            </div>
        </div>
    </aside>
  );
}
