class VideoData{
    constructor(name, cover_src, video_src, link, playlists, date, length){
        this.name = name;
        this.cover_src = cover_src;
        this.video_src = video_src;
        this.link = link;
        this.playlists = playlists;
        this.date = new Date(date);

        var lengthArgs = length.split(':');
        this.length = parseInt(lengthArgs[1]) + (60 * parseInt(lengthArgs[0]))
        this.lengthDisplay = length;
    }
}

var videoData = [
    new VideoData("honey wake up, theres a new valorant video", "wake_up.jpg", "wake_up.mp4", "https://youtu.be/GMns9kPb4NM", ["season_2"], '2022-02-11', "4:41"),
    new VideoData("Narodni Valorant", "narodni_valorant.jpg", "kise_jesenje.mp4", "https://youtu.be/w7NjhHvuyMo", ["season_2"], '2021-06-02', "3:17"),
    new VideoData("The Valorant Boss", "valorant_boss.jpg", "valorant_boss.mp4", "https://youtu.be/A8zgrOizOiU", ["season_2"], '2021-04-13', "8:18"),
    new VideoData("When the homies get back into Valorant", "back_into_valorant.jpg", "back_into_valorant.mp4", "https://youtu.be/13BtAjMSz0c", ["season_2"], '2021-04-11', "9:41"),
    new VideoData("Valorant O'Clock", "valorant_oclock.jpg", "valorant_oclock.mp4", "https://youtu.be/w32IvJoogzA", ["season_2"], '2020-12-06', "1:06"),

    new VideoData("when new video tho???", "when_video.jpg", "when_video.mp4", "https://youtu.be/qnLo3-Oplkw", ["season_1"], '2020-12-05', "5:31"),
    new VideoData("recycle_bin.mp3", "recycle_bin.jpg", "recycle_bin.mp4", "https://youtu.be/_O24ofB0OYs", ["season_1"], '2020-10-19', "3:23"),
    new VideoData("Pandas", "pandas.jpg", "pandas.mp4", "https://youtu.be/F1sht39iy-M", ["season_1"], '2020-01-31', "5:58"),
    new VideoData("CSGO Adventures 2", "csgo_adventures2.jpg", "csgo_adventures2.mp4", "https://youtu.be/FBYDCNqkaaM", ["season_1"], '2019-08-28', "5:01"),
    new VideoData("CSGO Adventures", "csgo_adventures.jpg", "csgo_adventures.mp4", "https://youtu.be/VUe8ZaH4Cw4", ["season_1"], '2018-05-14', "5:04"),

    new VideoData("Paladins Montage 1", "paladins_montage.jpg", "paladins_montage.mp4","https://youtu.be/4zjtdl7Gkjg",["prehistoric","hidden"], '2018-03-18',"3:39"),
    new VideoData("Black Jack Frag Montage", "black_jack.jpg", "black_jack.mp4","https://youtu.be/N7Jfjfjf3c0",["prehistoric","hidden"], '2017-07-26',"3:14"),
    new VideoData("Nutty Jump Shot", "jump_shot.jpg", "jump_shot.mp4","https://youtu.be/pF14fEH_DqQ",["prehistoric","hidden"], '2017-07-25',"0:35"),
    new VideoData("HomingLesi Frag Movie #2", "frag_movie2.jpg", "frag_movie2.mp4","https://youtu.be/kg3HutD-eyc",["prehistoric","hidden"], '2017-07-16',"1:13"),
    new VideoData("HomingLesi Frag Movie #1", "frag_movie.jpg", "frag_movie.mp4","https://youtu.be/H4J4R8HnL4Q",["prehistoric","hidden"], '2017-07-15',"2:52"),

    new VideoData("why you always gotta talk talk talk talk talk", "smile.jpg", "smile.mp4", "https://youtu.be/Lu1OYLkg1q4",["osu"],'2022-02-05','2:31'),
    new VideoData("she's got a minigun", "small_gun.jpg", "small_gun.mp4", "https://youtu.be/SGWxpe27UFE",["osu"],'2022-01-31','3:19'),
    new VideoData("when the map is too short for the nerves to kick in", "fast_400.jpg", "fast_400.mp4", "https://youtu.be/JOeJqa3Db9Q",["osu"],'2022-01-04','1:07'),
    new VideoData("The Legendary Sword Gambit", "legendary_sword.jpg", "legendary_sword.mp4", "https://youtu.be/4ct7KMVNJD4",["osu"],'2022-01-03','1:30'),
    new VideoData("My first 400pp play on Through the Fire and the Flames", "first_400.jpg", "first_400.mp4", "https://youtu.be/9HRPIXOQNoE",["osu"],'2021-09-19','7:28'),
    new VideoData("never give up", "7_star.jpg", "7_star.mp4", "https://youtu.be/4DWtG8175B4",["osu"],'2021-06-03','1:36'),
    new VideoData("osu! Ray| 337pp FC", "ray.jpg", "ray.mp4", "https://youtu.be/s0db1iSOpU4",["osu"],'2020-05-29','3:52'),
    new VideoData("osu! 115 | 299pp FC", "115.jpg", "115.mp4", "https://youtu.be/FF9YfjsLeA4",["osu"],'2020-05-29','3:09'),
    new VideoData("osu! Shinzou o Sasageyo! | 201pp FC", "alternator_first.jpg", "alternator_first.mp4", "https://youtu.be/DHtZCYPWx8Y",["osu"],'2019-11-06','1:35'),
    new VideoData("osu! Doki Doki Literature Club +DTHD | FC", "ddlc_second.jpg", "ddlc_second.mp4", "https://youtu.be/E46I8cmFKtw",["osu"],'2019-10-28','1:28'),
    new VideoData("osu! AaAaAaAAaAaAAa | 303pp FC", "first_300.jpg", "first_300.mp4", "https://youtu.be/4tE8mHYzUik",["osu"],'2019-10-27','1:53'),
    new VideoData("Osu! Montage", "osu_montage.jpg", "osu_montage.mp4", "https://youtu.be/fikOA7U7D8k",["osu"],'2018-03-19','11:00'),
    new VideoData("Icon for Hire - Hope of Morning Intro FC", "hope_of_morning.jpg", "hope_of_morning.mp4", "https://youtu.be/2wP9VnDPQf4",["osu"],'2017-12-24','1:04'),
    new VideoData("DDLC Main Theme Hidden FC", "ddlc_first.jpg", "ddlc_first.mp4", "https://youtu.be/EtnFKz3XbQk",["osu"],'2017-12-18','2:10'),

    new VideoData("i wake up in the morning i got murder on my mind", "peh_speedrun.jpg", "peh_speedrun.mp4", "https://youtu.be/ckJJKMBP0A0",["osu"],'2021-06-18','0:27'),
    new VideoData("Ma ne trese mi se ruka cini ti se", "hand_shake.jpg", "hand_shake.mp4", "https://youtu.be/MpT42Gupv5M",["osu"],'2020-08-08','0:42'),
    new VideoData("Sicko Mode", "league_clutch.jpg", "league_clutch.mp4", "https://youtu.be/ir6zqhf_AyA",["random"],'2020-04-08','1:26'),
    new VideoData("what is die?", "never_die.jpg", "never_die.mp4", "https://youtu.be/Kpy0isGtZ0Q",["random"],'2020-03-16','0:59'),
    new VideoData("Putic Rage", "putic_rage.jpg", "putic_rage.mp4", "https://youtu.be/GwvqqCL8tu4",["random"],'2018-03-18','1:50'),
    new VideoData("GH Halestorm - Love Bites", "love_bites.jpg", "love_bites.mp4", "https://youtu.be/lu4wqOnVcCs",["random"],'2018-02-21','0:32'),
]

export default videoData;