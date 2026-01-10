-- Create feedback table for issue ratings
CREATE TABLE public.issue_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  resolution_satisfaction INTEGER NOT NULL CHECK (resolution_satisfaction >= 1 AND resolution_satisfaction <= 5),
  speed_of_work INTEGER NOT NULL CHECK (speed_of_work >= 1 AND speed_of_work <= 5),
  communication_quality INTEGER NOT NULL CHECK (communication_quality >= 1 AND communication_quality <= 5),
  overall_experience INTEGER NOT NULL CHECK (overall_experience >= 1 AND overall_experience <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(issue_id, user_id)
);

-- Add average_rating column to issues table
ALTER TABLE public.issues ADD COLUMN average_rating NUMERIC(2,1) DEFAULT NULL;

-- Enable RLS
ALTER TABLE public.issue_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for feedback
CREATE POLICY "Users can view feedback for any issue"
ON public.issue_feedback
FOR SELECT
USING (true);

CREATE POLICY "Users can submit feedback for their own issues"
ON public.issue_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
ON public.issue_feedback
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to calculate and update average rating
CREATE OR REPLACE FUNCTION public.update_issue_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.issues
  SET average_rating = (
    SELECT ROUND(AVG((resolution_satisfaction + speed_of_work + communication_quality + overall_experience) / 4.0)::numeric, 1)
    FROM public.issue_feedback
    WHERE issue_id = COALESCE(NEW.issue_id, OLD.issue_id)
  )
  WHERE id = COALESCE(NEW.issue_id, OLD.issue_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to update average rating on feedback changes
CREATE TRIGGER update_rating_on_feedback
AFTER INSERT OR UPDATE OR DELETE ON public.issue_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_issue_average_rating();