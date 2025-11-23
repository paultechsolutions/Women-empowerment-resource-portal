import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, BookOpen, Award } from 'lucide-react';

interface Profile {
  full_name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
}

interface Enrollment {
  id: string;
  progress: number;
  completed: boolean;
  courses: {
    title: string;
    description: string;
  };
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchProfile();
      fetchEnrollments();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          progress,
          completed,
          courses (
            title,
            description
          )
        `)
        .eq('user_id', user!.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      console.error('Failed to load enrollments:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
        })
        .eq('id', user!.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-8">My Profile</h1>

            <div className="grid gap-6">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location || ''}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profile.website || ''}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          placeholder="https://yoursite.com"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    My Courses
                  </CardTitle>
                  <CardDescription>Track your learning progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrollments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      You haven't enrolled in any courses yet. Browse our courses to get started!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="p-4 rounded-lg bg-secondary/20 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{enrollment.courses.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {enrollment.courses.description}
                              </p>
                            </div>
                            {enrollment.completed && (
                              <Award className="w-5 h-5 text-accent" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-accent rounded-full h-2 transition-all duration-300"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
