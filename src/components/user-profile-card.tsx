'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Briefcase, Calendar, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function UserProfileCard() {
  const { user } = useUser();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    phone: '',
    location: '',
    occupation: '',
    bio: '',
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!user) return;

      try {
        const { getProfileLocal } = await import('@/lib/local-storage-avatar');
        const profile = getProfileLocal(user.uid);
        
        if (profile) {
          setUserInfo({
            phone: profile.phone || '',
            location: profile.location || '',
            occupation: profile.occupation || '',
            bio: profile.bio || '',
          });
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, [user]);

  if (!user) {
    return null;
  }

  const joinDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long' 
      })
    : 'N/A';

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/settings')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback className="text-xl">
              {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.displayName || 'Người dùng'}</h3>
            <Badge variant="secondary" className="mt-1">
              {user.emailVerified ? 'Đã xác minh' : 'Chưa xác minh'}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {user.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          )}
          
          {userInfo.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{userInfo.location}</span>
            </div>
          )}
          
          {userInfo.occupation && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{userInfo.occupation}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Tham gia {joinDate}</span>
          </div>
        </div>

        {userInfo.bio && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{userInfo.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
