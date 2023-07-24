insert into products (title, description, price, image_url)
values
  ('The Pallbearer', 'Comedy', 72, 'https://d2tbewbqvvmzls.cloudfront.net/images/the_pallbearer.jpg'),
  ('Nightcrawler', 'Crime|Drama|Thriller', 99, 'https://d2tbewbqvvmzls.cloudfront.net/images/nightcrawler.jpg'),
  ('Frankenstein''s Army', 'Action|Horror|Sci-Fi', 1, 'https://d2tbewbqvvmzls.cloudfront.net/images/frankensteins_army.jpg'),
  ('Johnny Suede', 'Comedy|Musical|Romance', 69, 'https://d2tbewbqvvmzls.cloudfront.net/images/johnny_suede.jpg'),
  ('The Main Event', 'Comedy', 77, 'https://d2tbewbqvvmzls.cloudfront.net/images/the_main_event.jpg'),
  ('Around the Bend', 'Drama', 18, 'https://d2tbewbqvvmzls.cloudfront.net/images/around_the_bend.jpg'),
  ('A Hole in My Heart', 'Drama', 10, 'https://d2tbewbqvvmzls.cloudfront.net/images/a_hole_in_my_heart.jpg'),
  ('The Inbetweeners Movie', 'Adventure|Comedy', 64, 'https://d2tbewbqvvmzls.cloudfront.net/images/the_inbetweeners_movie.jpg'),
  ('The Toast of New York', 'Comedy|Drama|War', 21, 'https://d2tbewbqvvmzls.cloudfront.net/images/the_toast_of_new_york.jpg'),
  ('Road House', 'Drama|Film-Noir', 94, 'https://d2tbewbqvvmzls.cloudfront.net/images/road_house.jpg');

insert into stocks (product_id, count)
select p.id, s.count
from (
  values
  ('The Pallbearer', 1),
  ('Nightcrawler', 2),
  ('Frankenstein''s Army', 3),
  ('Johnny Suede', 4),
  ('The Main Event', 5),
  ('Around the Bend', 6),
  ('A Hole in My Heart', 7),
  ('The Inbetweeners Movie', 8),
  ('The Toast of New York', 9),
  ('Road House', 10)
) as s(title, count)
join products p on p.title = s.title;