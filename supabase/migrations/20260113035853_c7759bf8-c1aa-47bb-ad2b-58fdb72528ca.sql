-- Allow users to delete their own issues
CREATE POLICY "Users can delete their own issues"
ON public.issues
FOR DELETE
USING (auth.uid() = user_id);