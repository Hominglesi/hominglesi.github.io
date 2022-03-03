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
    new VideoData("CSGO Adventures", "csgo_adventures.jpg", "csgo_adventures.mp4", "https://youtu.be/VUe8ZaH4Cw4", ["season_1"], '2018-05-14', "5:04")
]

export default videoData;