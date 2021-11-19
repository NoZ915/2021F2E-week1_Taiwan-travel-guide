const keyword = document.querySelector('.keyword')
const limit = document.querySelector('.limit')
const send = document.querySelector('.send')
const list = document.querySelector('.list')
const city = document.querySelector('.city')
const category = document.querySelector('.category')

const keywordText = keyword.value
const cityName = city.value
const categorySelect = category.value

//--------------------------------
//       banner container
//--------------------------------
send.addEventListener("click", function (e) {

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
slides.addEventListener("click", function (e) {

  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/${categorySelect}/${cityName}?&$top=50&$format=JSON`,
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