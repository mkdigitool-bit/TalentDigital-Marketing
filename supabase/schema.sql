create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  nom text not null,
  email text not null,
  telephone text,
  service text not null,
  budget text,
  message text not null
);

create table general_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  email text not null,
  telephone text,
  message text not null
);
