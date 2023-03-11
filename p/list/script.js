let content_avs = ["im0","im1","im2","im3","im4","im5","im6","im7","im8"];
let content_guns = ["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","h1","h2","h3","h4","h5","h6","r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","s1","s2","s3","s4","s5","s6","s7"];
let content_pistols = ["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10"];
let content_heavys = ["h1","h2","h3","h4","h5","h6"];
let content_rifles = ["r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11"];
let content_smgs = ["s1","s2","s3","s4","s5","s6","s7"];
let content_maps = ["m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","m11"];
let content_ow_heroes = ["h1","h2","h3","h4","h5","h6","h7","h8","h9","h10","h11","h12","h13","h14","h15","h16","h17","h18","h19","h20","h21","h22","h23","h24","h25","h26","h27","h28","h29","h30","h31","h32","h33","h34","h35","h36"];
let content_selected;

let img_class = "list_img";
let img_class_selected = "list_img_selected";
let img_class_tier = "tier_img";

let avatar_selected;
let remaining;



function load_imgs(img_type){
  document.getElementById("button_list").style.display = "none";
  document.getElementById("button_list_cs").style.display = "none";
  document.getElementById("trash_buton").style.display = "flex";
  switch(img_type){
    case "avs" : content_selected = content_avs;break;
    case "guns" : content_selected = content_guns;
                  img_class = "list_img_34";
                  img_class_selected = "list_img_selected_34";
                  img_class_tier = "tier_img_34";
                  break;
    case "rifles" : content_selected = content_rifles;
                  img_class = "list_img_34";
                  img_class_selected = "list_img_selected_34";
                  img_class_tier = "tier_img_34";
                  break;
    case "pistols" : content_selected = content_pistols;
                  img_class = "list_img_34";
                  img_class_selected = "list_img_selected_34";
                  img_class_tier = "tier_img_34";
                  break;
    case "heavys" : content_selected = content_heavys;
                  img_class = "list_img_34";
                  img_class_selected = "list_img_selected_34";
                  img_class_tier = "tier_img_34";
                  break;
    case "smgs" : content_selected = content_smgs;
                  img_class = "list_img_34";
                  img_class_selected = "list_img_selected_34";
                  img_class_tier = "tier_img_34";
                  break;
    case "maps" : content_selected = content_maps;
                  img_class = "list_img_35";
                  img_class_selected = "list_img_selected_35";
                  img_class_tier = "tier_img_35";
                  break;
    case "ow_heroes" : content_selected = content_ow_heroes;
                  img_class = "list_img_ow";
                  img_class_selected = "list_img_selected_ow";
                  img_class_tier = "tier_img_ow";
                  break;

  }
  remaining = content_selected.length;

  for(let str in content_selected){
    let img_obj = document.createElement("IMG");
    img_obj.src = "content/"+img_type+"/"+content_selected[str]+".png";
    img_obj.classList.add(img_class);
    img_obj.onclick = function(){select_img(img_obj)};
    document.getElementById('img_list').appendChild(img_obj);
  }
  document.addEventListener('keydown', event=>{ key_func(event);});
}

function select_img(obj){
  if(avatar_selected!=undefined){
  avatar_selected.classList.remove(img_class_selected);
  avatar_selected.classList.add(img_class);
  }
  avatar_selected = obj;
  avatar_selected.classList.remove(img_class);
  avatar_selected.classList.add(img_class_selected);
}

function add_img(tier){
  if(avatar_selected!=undefined){
    let img_obj_list = document.createElement("IMG");
    img_obj_list.src = avatar_selected.src;
    img_obj_list.classList.add(img_class_tier);
    document.getElementById(tier).appendChild(img_obj_list);
    avatar_selected.style.display="none";
    avatar_selected = undefined;
    remaining--;
    if(remaining==0){
      document.getElementById("trash_buton").style.display = "none";
    }
  }
}

function delete_img(){
  if(avatar_selected!=undefined){
    avatar_selected.style.display="none";
    avatar_selected = undefined;
    remaining--;
    if(remaining==0){
      document.getElementById("trash_buton").style.display = "none";
    }
  }
}

function load_CSGO(){
  document.getElementById("button_list").style.display = "none";
  document.getElementById("button_list_cs").style.display = "block";
}

function key_func(ev){
  if(avatar_selected!=undefined){
    let tier_key;
    switch(ev.keyCode){
      case 83 : tier_key = "tier_s";break;
      case 65 : tier_key = "tier_a";break;
      case 66 : tier_key = "tier_b";break;
      case 67 : tier_key = "tier_c";break;
      case 68 : tier_key = "tier_d";break;
    }
    let img_obj_list = document.createElement("IMG");
    img_obj_list.src = avatar_selected.src;
    img_obj_list.classList.add(img_class_tier);
    document.getElementById(tier_key).appendChild(img_obj_list);
    avatar_selected.style.display="none";
    avatar_selected = undefined;
    remaining--;
    if(remaining==0){
      document.getElementById("trash_buton").style.display = "none";
    }
  }
  switch(ev.keyCode){
    case 83 :
  }
}
