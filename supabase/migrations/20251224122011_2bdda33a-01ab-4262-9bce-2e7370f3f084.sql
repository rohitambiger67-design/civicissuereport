-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create issues table
CREATE TABLE public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    area TEXT,
    city TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    likes INTEGER NOT NULL DEFAULT 0,
    reports INTEGER NOT NULL DEFAULT 1,
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on issues
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can view issues (public data)
CREATE POLICY "Anyone can view issues"
ON public.issues
FOR SELECT
USING (true);

-- RLS: Authenticated users can create issues
CREATE POLICY "Authenticated users can create issues"
ON public.issues
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS: Users can update their own issues
CREATE POLICY "Users can update their own issues"
ON public.issues
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS: Admins can update any issue
CREATE POLICY "Admins can update any issue"
ON public.issues
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Admins can delete any issue
CREATE POLICY "Admins can delete any issue"
ON public.issues
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at on issues
CREATE TRIGGER update_issues_updated_at
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for issue photos
INSERT INTO storage.buckets (id, name, public) VALUES ('issues', 'issues', true);

-- Storage policy: Anyone can view issue images
CREATE POLICY "Anyone can view issue images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'issues');

-- Storage policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload issue images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'issues');

-- Storage policy: Admins can delete issue images
CREATE POLICY "Admins can delete issue images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'issues' AND public.has_role(auth.uid(), 'admin'));

-- Insert some sample issues for demonstration
INSERT INTO public.issues (user_id, image_url, category, description, latitude, longitude, area, city, status, likes, reports, assigned_to) VALUES
(NULL, 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400', 'roads', 'Large pothole causing traffic issues near main market', 15.3647, 75.1240, 'Deshpande Nagar', 'Hubli', 'pending', 24, 3, 'Roads & Infrastructure Dept.'),
(NULL, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'garbage', 'Garbage pile not cleared for 3 days', 15.3521, 75.1343, 'Vidyanagar', 'Hubli', 'inProgress', 18, 2, 'Solid Waste Management'),
(NULL, 'https://images.unsplash.com/photo-1504387103978-e4ee71416c38?w=400', 'streetlights', 'Street light not working for past week', 15.4589, 75.0078, 'Saptapur', 'Dharwad', 'resolved', 12, 1, 'Electrical Division'),
(NULL, 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400', 'drainage', 'Blocked drainage causing water logging', 15.3698, 75.1456, 'Keshwapur', 'Hubli', 'pending', 31, 5, 'Drainage & Sewage Dept.'),
(NULL, 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400', 'water', 'Low water pressure in the area', 15.4423, 75.0234, 'Narayanpur', 'Dharwad', 'inProgress', 15, 2, 'Water Supply Dept.');