-- TuningBook — tighten photo storage limits (run once in Supabase → SQL Editor).
-- Photos are compressed to JPEG in the browser before upload, so each file is small.
update storage.buckets
   set file_size_limit = 5242880,          -- 5 MB per file
       allowed_mime_types = array['image/jpeg']
 where id = 'photos';
