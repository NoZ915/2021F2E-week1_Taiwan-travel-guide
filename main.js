const keyword = document.querySelector('.keyword')
const limit = document.querySelector('.limit')
const send = document.querySelector('.send')
const list = document.querySelector('.list')
const city = document.querySelector('.city')
const category = document.querySelector('.category')

//--------------------------------
//       banner container
//--------------------------------
send.addEventListener("click", function (e) {
  const keywordText = keyword.value
  const cityName = city.value
  const categorySelect = category.value

  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/${categorySelect}/${cityName}?$filter=contains(Name,'${keywordText}')&$top=50&$format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      const thisData = response.data
      console.log(thisData)
      let str = ""

      thisData.forEach(item => {
        if (item.Picture.PictureUrl1) {
          const img = document.createElement("img")
          img.src = item.Picture.PictureUrl1
          str +=
            `
            <div class="list_card">
              <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
              <span class="list_sapn">${item.Name}</span>
              <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
            </div>
            `
        }
      })
      list.innerHTML = str
    })
    .catch(function (error) {
      console.log(error)
    })
})



//--------------------------------
//       hot-city_conatiner      
//--------------------------------
// slides.addEventListener("click", function (e) {

//   axios.get(
//     `https://ptx.transportdata.tw/MOTC/v2/Tourism/${categorySelect}/${cityName}?&$top=50&$format=JSON`,
//     {
//       headers: getAuthorizationHeader()
//     }
//   )
//     .then(function (response) {
//       const thisData = response.data
//       console.log(thisData)
//       let str = ""

//       thisData.forEach(item => {
//         if (item.Picture.PictureUrl1) {
//           const img = document.createElement("img")
//           img.src = item.Picture.PictureUrl1
//           str +=
//             `
//             <div class="list_card">
//               <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
//               <span class="list_sapn">${item.Name}</span>
//               <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
//             </div>
//             `
//         }
//       })
//       list.innerHTML = str
//     })
//     .catch(function (error) {
//       console.log(error)
//     })
// })



//--------------------------------
//     hot-activity_conatiner      
//--------------------------------
const hotActivityContainer = document.querySelector(".hot-activity_container")

axios.get(
  `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$top=50&$format=JSON`,
  {
    headers: getAuthorizationHeader()
  }
)
  .then(function (response) {
    const thisData = response.data
    console.log(thisData)
    let str = ""
    let itemArray = []
    let dateArray = []

    thisData.forEach(item => {
      if (item.Picture.PictureUrl1) {
        //把item丟進陣列裡面
        itemArray.push(item)
        console.log(itemArray)

        //時間處理
        const dateString = item.StartTime
        const date = dateString.substring(0, 10)
        const dateOnlyArray = date.split("-")
        const dateOnlyString = dateOnlyArray.join("")

        dateArray.push(dateOnlyString)
        console.log(dateArray)

        //圖片處理
        const img = document.createElement("img")
        img.src = item.Picture.PictureUrl1
        str +=
          `
          <div class="hot-activity_block">
            <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
            <span class="list_sapn">${item.Name}</span>
            <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
          </div>
          `
      }
    })
    hotActivityContainer.innerHTML = str
  })
  .catch(function (error) {
    console.log(error)
  })



//--------------------------------
//     getAuthorizationHeader
//--------------------------------
function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = '4f2c7e3696e84ec2bcf3d7a3ba93abe7';
  let AppKey = 'ygFUYETAQklHaLKz5pNSF4FPwrA';
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString };
}

//拿到 App ID 和 App Key 後就可以開始拿資料了，只是取資料的時候必須使用平臺提供的 HMAC 認證授權機制。
//HMAC 授權機制在每次取得 API 時要在 header 塞兩個參數：Authorization 和 X-Date。



//--------------------------------
//     a新增onclick事件，可滑動
//--------------------------------
const leftButtonAnchor = document.querySelector('.next-page_left-anchor')
const rightButtonAnchor = document.querySelector('.next-page_right-anchor')
const leftButton = document.querySelector('.next-page_left-button')
const rightButton = document.querySelector('.next-page_right-button')
const slides = document.querySelector('.slides')

leftButtonAnchor.addEventListener('click', function () {
  slides.style = "transform: translateX(-1062px)"
  leftButton.style = "visibility: hidden"
  rightButton.style = "visibility: visible"
})
rightButtonAnchor.addEventListener('click', function () {
  slides.style = "transform: translateX(0px)"
  rightButton.style = "visibility: hidden"
  leftButton.style = "visibility: visible"
})