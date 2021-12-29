export default function lightboxFunction(lightboxString, targetID, img, targetName, targetDescription) {
  var lightboxString = lightboxString +
    `
    <div class="lightbox" id="${targetID}ScenicSpot">
      <div class="lightbox_all">
        <div class="lightbox_left">
          <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
          <span class="lightbox_span">${targetName}</span>
          <p class="lightbox_p">${targetDescription}</p>
        </div>
        <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
      </div>
    </div>
  `
  return lightboxString
}