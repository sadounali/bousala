import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  Share2, 
  BarChart3, 
  Bell, 
  Settings, 
  TrendingUp, 
  UserCheck, 
  UserPlus, 
  Search,
  MoreVertical,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail,
  Filter,
  FileText,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

enum AdminTab {
    STATS = 'STATS',
    USERS = 'USERS',
    SUBSCRIPTIONS = 'SUBSCRIPTIONS',
    REFERRALS = 'REFERRALS',
    REPORTS = 'REPORTS',
    NOTIFICATIONS = 'NOTIFICATIONS',
    SETTINGS = 'SETTINGS'
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.STATS);
  const isAr = i18n.language === 'ar';

  const menuItems = [
    { id: AdminTab.STATS, label: isAr ? 'إحصائيات فورية' : 'Real-time Stats', icon: TrendingUp },
    { id: AdminTab.USERS, label: isAr ? 'إدارة المستخدمين' : 'User Management', icon: Users },
    { id: AdminTab.SUBSCRIPTIONS, label: isAr ? 'إدارة الاشتراكات' : 'Subscriptions', icon: CreditCard },
    { id: AdminTab.REFERRALS, label: isAr ? 'إدارة الإحالات' : 'Referrals', icon: Share2 },
    { id: AdminTab.REPORTS, label: isAr ? 'تقارير وإحصائيات' : 'Reports & Analytics', icon: BarChart3 },
    { id: AdminTab.NOTIFICATIONS, label: isAr ? 'نظام الإشعارات' : 'Notifications', icon: Bell },
    { id: AdminTab.SETTINGS, label: isAr ? 'إعدادات التطبيق' : 'App Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? 'لوحة تحكم المشرف' : 'Admin Dashboard'}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {isAr ? 'مرحباً، يمكنك إدارة كافة جوانب المنصة من هنا' : 'Welcome, manage all aspects of the platform here'}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Download className="w-4 h-4" />
                {isAr ? 'تصدير التقرير' : 'Export Report'}
            </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === item.id 
                ? 'bg-oued-blue text-white border-oued-blue shadow-lg shadow-oued-blue/20' 
                : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="min-h-[500px]"
        >
          {activeTab === AdminTab.STATS && <StatsOverview isAr={isAr} />}
          {activeTab === AdminTab.USERS && <UserManagement isAr={isAr} />}
          {activeTab === AdminTab.SUBSCRIPTIONS && <SubscriptionManagement isAr={isAr} />}
          {activeTab === AdminTab.REFERRALS && <ReferralManagement isAr={isAr} />}
          {activeTab === AdminTab.SETTINGS && <AppSettings isAr={isAr} />}
          {/* Add more tabs as needed */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StatsOverview({ isAr }: { isAr: boolean }) {
    const stats = [
        { label: isAr ? 'إجمالي المستخدمين' : 'Total Users', value: '1,284', change: '+12%', icon: Users, color: 'bg-blue-50 text-blue-600' },
        { label: isAr ? 'التحليلات المكتملة' : 'Analyses Done', value: '452', change: '+25%', icon: BarChart3, color: 'bg-emerald-50 text-emerald-600' },
        { label: isAr ? 'المشتركين المميزين' : 'Premium Users', value: '86', change: '+5%', icon: ShieldCheck, color: 'bg-purple-50 text-purple-600' },
        { label: isAr ? 'إجمالي الإيرادات' : 'Total Revenue', value: '3,250$', change: '+8%', icon: CreditCard, color: 'bg-amber-50 text-amber-600' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="minimal-card p-6 bg-white flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="minimal-card p-6 bg-white">
                    <h3 className="text-sm font-bold text-slate-800 mb-6">{isAr ? 'التحليلات الأخيرة' : 'Recent Analyses'}</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">مذكرة تخرج - ذكاء اصطناعي.pdf</p>
                                        <p className="text-[10px] text-slate-400">منذ 10 دقائق • طالب: علي سادون</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">94%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="minimal-card p-6 bg-white">
                    <h3 className="text-sm font-bold text-slate-800 mb-6">{isAr ? 'النشاط الأخير' : 'Recent Activity'}</h3>
                    <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="relative flex items-center gap-6 pl-10">
                                <div className="absolute left-2 w-4 h-4 rounded-full bg-oued-blue border-4 border-white shadow-sm -ml-2" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-800">
                                        <span className="font-bold">أحمد محمد</span> قام بترقية حسابه إلى <span className="text-purple-600 font-bold">مميز</span>
                                    </p>
                                    <p className="text-[10px] text-slate-400">منذ ساعتين</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserManagement({ isAr }: { isAr: boolean }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="minimal-card bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder={isAr ? 'البحث عن مستخدم...' : 'Search users...'}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-oued-blue transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
                        <Filter className="w-4 h-4" />
                        {isAr ? 'تصفية' : 'Filter'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-oued-blue text-white rounded-xl text-xs font-bold hover:bg-oued-blue/90 transition-all shadow-md">
                        <UserPlus className="w-4 h-4" />
                        {isAr ? 'إضافة مستخدم' : 'Add User'}
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left" dir={isAr ? 'rtl' : 'ltr'}>
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'المستخدم' : 'User'}</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'الحالة' : 'Status'}</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'الخطة' : 'Plan'}</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{isAr ? 'فعل' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                            A
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">أحمد بن محمد</p>
                                            <p className="text-xs text-slate-400 font-mono">ahmed@ univ.dz</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        {isAr ? 'نشط' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${i % 2 === 0 ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
                                        {i % 2 === 0 ? (isAr ? 'مميز' : 'Premium') : (isAr ? 'مجاني' : 'Free')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {isAr ? 'عرض 5 من أصل 1,284 مستخدم' : 'Showing 5 of 1,284 users'}
                </span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold border border-slate-200">1</button>
                    <button className="px-3 py-1 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50">2</button>
                    <button className="px-3 py-1 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50">3</button>
                </div>
            </div>
        </div>
    );
}

function SubscriptionManagement({ isAr }: { isAr: boolean }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <div className="minimal-card p-6 bg-white">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">{isAr ? 'خطط الاشتراك' : 'Subscription Plans'}</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-oued-blue relative overflow-hidden">
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className="w-5 h-5 text-oued-blue" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'مجاني' : 'Free'}</p>
                            <h4 className="text-xl font-black text-slate-800">0 دج</h4>
                            <p className="text-[10px] text-slate-500 mt-2">{isAr ? 'تحليل واحد شهرياً' : '1 Analysis / month'}</p>
                        </div>
                        <div className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-oued-blue/30 transition-all cursor-pointer">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'مميز' : 'Premium'}</p>
                            <h4 className="text-xl font-black text-slate-800">2,000 دج</h4>
                            <p className="text-[10px] text-slate-500 mt-2">{isAr ? 'تحليلات غير محدودة' : 'Unlimited Analysis'}</p>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                        {isAr ? 'تحديث الأسعار' : 'Update Pricing'}
                    </button>
                </div>
            </div>
            
            <div className="lg:col-span-2">
                <div className="minimal-card bg-white h-full">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">{isAr ? 'المعاملات المالية الأخيرة' : 'Recent Transactions'}</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">تجديد اشتراك مميز</p>
                                        <p className="text-[10px] text-slate-400 tracking-wider">REF-928347 • {isAr ? 'منذ 3 أيام' : '3 days ago'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-800">+2,000 دج</p>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{isAr ? 'مكتمل' : 'Completed'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReferralManagement({ isAr }: { isAr: boolean }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="minimal-card p-6 bg-white border-blue-100">
                    <Share2 className="w-8 h-8 text-blue-500 mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'إجمالي الإحالات' : 'Total Referrals'}</p>
                    <h3 className="text-2xl font-black text-slate-800">4,281</h3>
                    <p className="text-[10px] text-blue-500 font-bold mt-2">+120 {isAr ? 'هذا الأسبوع' : 'this week'}</p>
                </div>
                <div className="minimal-card p-6 bg-white border-emerald-100">
                    <UserCheck className="w-8 h-8 text-emerald-500 mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'تحويلات ناجحة' : 'Successful Conversions'}</p>
                    <h3 className="text-2xl font-black text-slate-800">842</h3>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2">19.6% {isAr ? 'معدل التحويل' : 'conversion rate'}</p>
                </div>
                <div className="minimal-card p-6 bg-white border-amber-100">
                    <CreditCard className="w-8 h-8 text-amber-500 mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'مكافآت مدفوعة' : 'Rewards Paid'}</p>
                    <h3 className="text-2xl font-black text-slate-800">45,000 دج</h3>
                    <p className="text-[10px] text-amber-500 font-bold mt-2">{isAr ? 'إجمالي المكافآت' : 'total rewards'}</p>
                </div>
            </div>

            <div className="minimal-card bg-white overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">{isAr ? 'أفضل المسوقين' : 'Top Affiliates'}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" dir={isAr ? 'rtl' : 'ltr'}>
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'المسوق' : 'Affiliate'}</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'الإحالات' : 'Referrals'}</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'المكاسب' : 'Earnings'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3].map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">طالب رقم {i + 1}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-600">{150 - (i * 20)}</td>
                                <td className="px-6 py-4 text-sm font-black text-emerald-600">{(150 - (i * 20)) * 100} دج</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AppSettings({ isAr }: { isAr: boolean }) {
    return (
        <div className="max-w-3xl space-y-6">
            <div className="minimal-card p-8 bg-white space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{isAr ? 'إعدادات النظام الأساسية' : 'Core System Settings'}</h3>
                    <p className="text-xs text-slate-400">{isAr ? 'تحكم في الوظائف الجوهرية للتطبيق' : 'Control core application functionality'}</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                            <p className="text-sm font-bold text-slate-800">{isAr ? 'وضع الصيانة' : 'Maintenance Mode'}</p>
                            <p className="text-[10px] text-slate-400">{isAr ? 'إيقاف الوصول مؤقتاً لجميع المستخدمين' : 'Temporarily disable access for all users'}</p>
                        </div>
                        <button className="w-12 h-6 bg-slate-200 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                            <p className="text-sm font-bold text-slate-800">{isAr ? 'تسجيل المستخدمين الجدد' : 'New User Registration'}</p>
                            <p className="text-[10px] text-slate-400">{isAr ? 'السماح للطلبة بإنشاء حسابات جديدة' : 'Allow students to create new accounts'}</p>
                        </div>
                        <button className="w-12 h-6 bg-emerald-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-800">{isAr ? 'نموذج الذكاء الاصطناعي' : 'AI Model Selection'}</p>
                        <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium">
                            <option>Gemini 1.5 Pro (Recommended)</option>
                            <option>Gemini 1.5 Flash (Faster)</option>
                            <option>GPT-4o (Integration required)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-800">{isAr ? 'حد التحليلات للحساب المجاني' : 'Free Tier Analysis Limit'}</p>
                        <div className="flex items-center gap-4">
                            <input type="number" defaultValue={1} className="w-24 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? 'تحليل / شهر' : 'Analysis / month'}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <button className="px-8 py-3 bg-oued-blue text-white rounded-2xl text-sm font-bold hover:bg-oued-blue/90 transition-all shadow-lg shadow-oued-blue/20">
                        {isAr ? 'حفظ كافة الإعدادات' : 'Save All Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
