'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Bell, Palette, Globe, Shield, Loader2, Camera, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  
  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Preferences state
  const [language, setLanguage] = useState('vi');
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      
      // Load user profile from local storage
      try {
        const { getAvatarLocal, getProfileLocal } = await import('@/lib/local-storage-avatar');
        
        // Load avatar from IndexedDB
        const avatar = await getAvatarLocal(user.uid);
        if (avatar) {
          setPhotoURL(avatar);
        }
        
        // Load profile from localStorage
        const profile = getProfileLocal(user.uid);
        if (profile) {
          setPhone(profile.phone || '');
          setBio(profile.bio || '');
          setLocation(profile.location || '');
          setOccupation(profile.occupation || '');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
      
      // Load preferences
      const savedLanguage = localStorage.getItem('language') || 'vi';
      const savedTheme = localStorage.getItem('theme') || 'light';
      const savedEmailNotif = localStorage.getItem('emailNotifications') !== 'false';
      const savedPushNotif = localStorage.getItem('pushNotifications') !== 'false';
      const savedSound = localStorage.getItem('soundEnabled') !== 'false';
      
      setLanguage(savedLanguage);
      setTheme(savedTheme);
      setEmailNotifications(savedEmailNotif);
      setPushNotifications(savedPushNotif);
      setSoundEnabled(savedSound);
    };

    loadUserData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      // Update Firebase Auth profile (name only)
      await updateProfile(user, {
        displayName,
      });

      // Save to local storage
      const { saveProfileLocal } = await import('@/lib/local-storage-avatar');
      saveProfileLocal(user.uid, {
        displayName,
        email: user.email || '',
        phone,
        bio,
        location,
        occupation,
      });

      toast({
        title: 'Thành công!',
        description: 'Thông tin cá nhân đã được cập nhật.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: error.message || 'Không thể cập nhật thông tin.',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: 'Mật khẩu mới không khớp.',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: 'Mật khẩu phải có ít nhất 6 ký tự.',
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      toast({
        title: 'Thành công!',
        description: 'Mật khẩu đã được thay đổi.',
      });

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: error.code === 'auth/wrong-password' 
          ? 'Mật khẩu hiện tại không đúng.' 
          : 'Không thể thay đổi mật khẩu.',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdatingPreferences(true);
    try {
      // Save preferences to localStorage
      localStorage.setItem('language', language);
      localStorage.setItem('theme', theme);
      localStorage.setItem('emailNotifications', emailNotifications.toString());
      localStorage.setItem('pushNotifications', pushNotifications.toString());
      localStorage.setItem('soundEnabled', soundEnabled.toString());

      // Apply theme
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      toast({
        title: 'Thành công!',
        description: 'Tùy chọn đã được lưu.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: 'Không thể lưu tùy chọn.',
      });
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const { validateImageFile } = await import('@/lib/storage');
    const validation = validateImageFile(file);
    
    if (!validation.valid) {
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: validation.error,
      });
      return;
    }

    try {
      setIsUpdatingProfile(true);
      
      // Compress and convert to base64
      const { compressImage, saveAvatarLocal } = await import('@/lib/local-storage-avatar');
      const compressed = await compressImage(file, 500);
      
      // Show preview
      setPhotoURL(compressed);
      
      // Save to IndexedDB (local storage)
      await saveAvatarLocal(user.uid, compressed);
      
      toast({
        title: 'Thành công!',
        description: 'Ảnh đại diện đã được cập nhật.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi!',
        description: error.message || 'Không thể upload ảnh.',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Yêu cầu đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để truy cập cài đặt</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full pb-8">
      <ScrollArea className="h-full">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              Cài đặt tài khoản
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý thông tin cá nhân và tùy chọn của bạn
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Bảo mật
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Palette className="h-4 w-4 mr-2" />
                Tùy chọn
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Thông báo
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <form onSubmit={handleUpdateProfile}>
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin hồ sơ của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={photoURL} />
                        <AvatarFallback className="text-2xl">
                          {displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <Camera className="h-4 w-4" />
                            Thay đổi ảnh đại diện
                          </div>
                        </Label>
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG hoặc GIF. Tối đa 2MB.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Họ và tên</Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0123456789"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Địa chỉ</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Hà Nội, Việt Nam"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation">Nghề nghiệp</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="occupation"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          placeholder="Luật sư, Sinh viên, v.v."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Giới thiệu</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Viết vài dòng về bản thân..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Lưu thay đổi
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <form onSubmit={handleUpdatePassword}>
                <Card>
                  <CardHeader>
                    <CardTitle>Bảo mật</CardTitle>
                    <CardDescription>
                      Thay đổi mật khẩu và cài đặt bảo mật
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ít nhất 6 ký tự
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Xác thực hai yếu tố</h4>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Bật xác thực 2FA</Label>
                          <p className="text-sm text-muted-foreground">
                            Tăng cường bảo mật tài khoản
                          </p>
                        </div>
                        <Switch disabled />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Đổi mật khẩu
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <form onSubmit={handleUpdatePreferences}>
                <Card>
                  <CardHeader>
                    <CardTitle>Tùy chọn</CardTitle>
                    <CardDescription>
                      Tùy chỉnh trải nghiệm sử dụng
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">
                          <Globe className="inline h-4 w-4 mr-2" />
                          Ngôn ngữ
                        </Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vi">Tiếng Việt</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theme">
                          <Palette className="inline h-4 w-4 mr-2" />
                          Giao diện
                        </Label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger id="theme">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Sáng</SelectItem>
                            <SelectItem value="dark">Tối</SelectItem>
                            <SelectItem value="auto">Tự động</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Âm thanh</h4>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Bật âm thanh thông báo</Label>
                          <p className="text-sm text-muted-foreground">
                            Phát âm thanh khi có tin nhắn mới
                          </p>
                        </div>
                        <Switch
                          checked={soundEnabled}
                          onCheckedChange={setSoundEnabled}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingPreferences}>
                      {isUpdatingPreferences && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Lưu tùy chọn
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <form onSubmit={handleUpdatePreferences}>
                <Card>
                  <CardHeader>
                    <CardTitle>Thông báo</CardTitle>
                    <CardDescription>
                      Quản lý cách bạn nhận thông báo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email thông báo</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo qua email
                          </p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Thông báo đẩy</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo trên trình duyệt
                          </p>
                        </div>
                        <Switch
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Loại thông báo</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Luật mới được cập nhật</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Câu trả lời được xác minh</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Tin nhắn mới</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="font-normal">Cập nhật hệ thống</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingPreferences}>
                      {isUpdatingPreferences && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Lưu cài đặt
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
