// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

enum gender_status {
male
female
other
}

enum user_status {
banned
deleted
active
pending
}

enum referral_option {
senior
friend
homepage
other
}

enum user_type {
admin
mentor
student
}

enum study_status {
in_progress
graduated
}

Table user {
id varchar [primary key]
profile_id varchar
type user_type
status user_status
created_at timestamp
updated_at timestamp
}

Table user_ticket_history {
id varchar
user_id varchar
amount integer
created_at timestamp
updated_at timestamp
}

Table user_profile {
id varchar [primary key]
user_id varchar
first_name varchar
lastname_name varchar
middle_name varchar
first_name_kana varchar
lastname_name_kana varchar
middle_name_kana varchar
gender gender_status
nation_id varchar
address varchar
birthday datetime
phone varchar
phone_nation_id varchar
college varchar
post_college varchar
post_college_status study_status
college_status study_status
referral referral_option
referral_note varchar
}

Table user_major {
user_id varchar
major_id varchar
}

Table major [note: 'Master data, all the majors'] {
id varchar [primary key]
name varchar
parent_id varchar
}

Table nation [note: 'Master data, all the nations around the world'] {
id varchar [primary key]
name varchar
cca2 varchar
}

Ref: user_profile.nation_id > nation.id
Ref: user_profile.phone_nation_id > nation.id
Ref: user.profile_id - user_profile.id
Ref: user_ticket_history.user_id > user.id
Ref: major.parent_id > major.id
Ref: user_major.user_id > user.id
Ref: user_major.major_id > major.id

// Ref: posts.user_id > users.id // many-to-one

// Ref: users.id < follows.following_user_id

// Ref: users.id < follows.followed_user_id
