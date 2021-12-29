const keyword = document.querySelector('.keyword')
const limit = document.querySelector('.limit')
const send = document.querySelector('.send')
const newList = document.querySelector('.new-list')
const newList2 = document.querySelector('.new-list-2')
const city = document.querySelector('.city')
const category = document.querySelector('.category')

const hotCitySection = document.querySelector('.hot-city_section')
const hotActivitySection = document.querySelector('.hot-activity_section')
const hotScenicSpotSection = document.querySelector('.hot-scenic-spot_section')
const listSection = document.querySelector('.list_section')
const listH2 = document.querySelector(".list_h2")
const listH22 = document.querySelector(".list_h2-2")
const list = document.querySelector(".list")
const list2 = document.querySelector(".list2")
const hotCitySpanValue = document.querySelector(".hot-city_span-value")

const wrongPageSearchSection = document.querySelector(".wrong-search-page_section")

const hotActivityContainer = document.querySelector(".hot-activity_container")
const hotActivityRow1 = document.querySelector(".hot-activity_row1")
const hotActivityRow2 = document.querySelector(".hot-activity_row2")
const lightboxContainer = document.querySelector(".lightbox_container")
const lightboxContainer2 = document.querySelector(".lightbox_container-2")

//--------------------------------
//       banner container
//--------------------------------
send.addEventListener("click", function (e) {
  const keywordText = keyword.value
  const cityName = city.value
  const categorySelect = category.value

  //取得選項的文字
  const cityNameTextWithSpace = city.options[city.selectedIndex].text
  const categorySelectTextWithSpace = category.options[category.selectedIndex].text
  //移除取得的文字中出現的空格
  const cityNameText = cityNameTextWithSpace.split(" ").join("")
  const categorySelectText = categorySelectTextWithSpace.split(" ").join("")

  //把所有原先的內容給移除掉
  hotCitySection.setAttribute("class", "display_none")
  hotActivitySection.setAttribute("class", "display_none")
  hotScenicSpotSection.setAttribute("class", "display_none")
  list2.setAttribute("class", "display_none")
  listSection.setAttribute("class", "display_flex")

  //使用者搜尋景點
  if (categorySelect == "ScenicSpot") {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${cityName}?$filter=contains(ScenicSpotName,'${keywordText}')&$top=50&$format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        const thisData = response.data
        console.log(thisData)
        let str = ""
        let lightboxStr = ""

        if (response.data.length == 0) {
          wrongPageSearchSection.classList.remove("wrong-search-page_section")
          wrongPageSearchSection.setAttribute("class", "section")
          list.classList.add("display_none")
        } else {
          wrongPageSearchSection.classList.remove("section")
          wrongPageSearchSection.setAttribute("class", "wrong-search-page_section")
          list.classList.remove("display_none")
        }

        thisData.forEach(item => {
          if (item != undefined) {
            const img = document.createElement("img")
            img.src = item.Picture.PictureUrl1
            str +=
              `
            <a class="list_card" href="#${item.ScenicSpotID}ScenicSpot">
              <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
              <span class="list_sapn">${item.ScenicSpotName}</span>
              <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
            </a> 
            `

            lightboxStr +=
              `
            <div class="lightbox" id="${item.ScenicSpotID}ScenicSpot">
              <div class="lightbox_all">
                <div class="lightbox_left">
                  <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                  <span class="lightbox_span">${item.ScenicSpotName}</span>
                  <p class="lightbox_p">${item.DescriptionDetail}</p>
                  <div class="lightbox_detail">
                    <div>
                      <img src='./img/lightbox_address.png'>
                      <span>${item.Address ?? "沒有提供詳細地址"}</span>
                    </div>
                    <div>
                      <img src='./img/lightbox_phone.png'>
                      <span>${item.Phone ?? "沒有提供電話號碼"}</span>
                    </div>
                  </div>
                </div>
                <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
              </div>
            </div>
            `
          }
        })
        newList.innerHTML = str
        listH2.innerHTML = `${cityNameText} ${categorySelectText}  <h3>（關鍵字： ${keywordText}）</h3>`
        lightboxContainer2.innerHTML = lightboxStr
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  //使用者搜尋活動
  if (categorySelect == "Activity") {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/${cityName}?$filter=contains(ActivityName,'${keywordText}')&$top=50&$format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        const thisData = response.data
        console.log(thisData)
        let str = ""
        let lightboxStr = ""

        if (response.data.length == 0) {
          wrongPageSearchSection.classList.remove("wrong-search-page_section")
          wrongPageSearchSection.setAttribute("class", "section")
          list.classList.add("display_none")
          console.log("hi");
        } else {
          wrongPageSearchSection.classList.remove("section")
          wrongPageSearchSection.setAttribute("class", "wrong-search-page_section")
          list.classList.remove("display_none")
        }

        thisData.forEach(item => {
          if (item != undefined) {
            const img = document.createElement("img")
            img.src = item.Picture.PictureUrl1
            str +=
              `
              <a class="list_card" href="#${item.ActivityID}">
                <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
                <span class="list_sapn">${item.ActivityName}</span>
                <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
              </a> 
              `

            lightboxStr +=
              `
          <div class="lightbox" id ="${item.ActivityID}">
            <div class="lightbox_all">
              <div class="lightbox_left">
                <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                  <span class="lightbox_span">${item.ActivityName}</span>
                  <p class="lightbox_p">${item.Description}</p>
                  <div class="lightbox_detail">
                    <div>
                      <img src='./img/lightbox_time.png'>
                      <span>${item.StartTime.substring(0, 10)} ~ ${item.EndTime.substring(0, 10)}</span>
                    </div>
                    <div>
                      <img src='./img/lightbox_address.png'>
                      <span>${item.Address ?? "沒有提供詳細地址"}</span>
                    </div>
                    <div>
                      <img src='./img/lightbox_phone.png'>
                      <span>${item.Phone ?? "沒有提供電話號碼"}</span>
                    </div>
                  </div>
              </div>
              <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
            </div>
            </div>
          `
          }
        })
        newList.innerHTML = str
        listH2.innerHTML = `${cityNameText} ${categorySelectText}  <h3>（關鍵字： ${keywordText}）</h3>`
        lightboxContainer.innerHTML = lightboxStr
      })
      .catch(function (error) {
        console.log(error)
      })
  }

})




//--------------------------------
//     hot-activity_conatiner      
//--------------------------------
//利用bubble sort去做時間排序
function bubbleSort(dateArr, itemArr) {
  for (let i = 0; i < dateArr.length; i++) {
    for (let j = 0; j < dateArr.length - 1 - i; j++) {
      if (dateArr[j] > dateArr[j + 1]) {
        [dateArr[j], dateArr[j + 1]] = [dateArr[j + 1], dateArr[j]];
        [itemArr[j], itemArr[j + 1]] = [itemArr[j + 1], itemArr[j]];
      }
    }
  }
  return dateArr, itemArr
}

//串接api
axios.get(
  `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$top=50&$format=JSON`,
  {
    headers: getAuthorizationHeader()
  }
)
  .then(function (response) {
    const thisData = response.data
    console.log(thisData)
    let str1 = ""
    let str2 = ""
    let lightboxStr = ""
    let hotActivityItemArray = []
    let dateArray = []

    //處理時間先後排序
    thisData.forEach(item => {
      if (item.Picture.PictureUrl1) {
        //把item丟進陣列裡面
        hotActivityItemArray.push(item)

        //時間資料處理乾淨
        const dateString = item.StartTime
        const date = dateString.substring(0, 10)
        const dateOnlyArray = date.split("-")
        const dateOnlyString = dateOnlyArray.join("")

        dateArray.push(dateOnlyString)
      }
    })
    bubbleSort(dateArray, hotActivityItemArray)
    console.log(dateArray)
    console.log(hotActivityItemArray)
    dateArray.reverse();
    hotActivityItemArray.reverse();

    //用整理排序過的資料取兩筆（第一筆跟第二筆資料）
    for (let i = 0; i < 2; i++) {
      if (hotActivityItemArray[i].Picture.PictureUrl1) {
        //圖片處理
        const img = document.createElement("img")
        img.src = hotActivityItemArray[i].Picture.PictureUrl1
        str1 +=
          `
          <div class="hot-activity_block">
            <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="hot-activity_img">
            <div class="hot-activity_introduction">
              <span class="hot-activity_span">${hotActivityItemArray[i].ActivityName}</span>
              <p class="hot-activity_p">${hotActivityItemArray[i].Description}</p>
              <div class="hot-activity_address_container"><img src="./img/icon_map.png" class="icon_map"><span class="hot-activity_address_span">${hotActivityItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
              <a href="#${hotActivityItemArray[i].ActivityID}">活動詳情</a>
            </div>
          </div>
          `
      }
    }
    //用整理排序過的資料取兩筆（第三筆跟第四筆資料）
    for (let i = 2; i < 4; i++) {
      if (hotActivityItemArray[i].Picture.PictureUrl1) {
        //圖片處理
        const img = document.createElement("img")
        img.src = hotActivityItemArray[i].Picture.PictureUrl1
        console.log(hotActivityItemArray[i].ActivityID)
        str2 +=
          `
          <div class="hot-activity_block">
            <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="hot-activity_img">
            <div class="hot-activity_introduction">
              <span class="hot-activity_span">${hotActivityItemArray[i].ActivityName}</span>
              <p class="hot-activity_p">${hotActivityItemArray[i].Description}</p>
              <div class="hot-activity_address_container"><img src="./img/icon_map.png" class="icon_map"><span class="hot-activity_address_span">${hotActivityItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
              <a href="#${hotActivityItemArray[i].ActivityID}">活動詳情</a>
            </div>
          </div>
          `
      }
    }
    //用整理排序過的資料取前4筆製作成lightbox
    for (let i = 0; i < 4; i++) {
      if (hotActivityItemArray[i].Picture.PictureUrl1) {
        //圖片處理
        const img = document.createElement("img")
        img.src = hotActivityItemArray[i].Picture.PictureUrl1

        lightboxStr +=
          `
          <div class="lightbox" id ="${hotActivityItemArray[i].ActivityID}">
            <div class="lightbox_all">
              <div class="lightbox_left">
                <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                  <span class="lightbox_span">${hotActivityItemArray[i].ActivityName}</span>
                  <p class="lightbox_p">${hotActivityItemArray[i].Description}</p>
                  <div class="lightbox_detail">
                    <div>
                      <img src='./img/lightbox_time.png'>
                      <span>${hotActivityItemArray[i].StartTime.substring(0, 10)} ~ ${hotActivityItemArray[i].EndTime.substring(0, 10)}</span>
                    </div>
                    <div>
                      <img src='./img/lightbox_address.png'>
                      <span>${hotActivityItemArray[i].Address ?? "沒有提供詳細地址"}</span>
                    </div>
                    <div>
                      <img src='./img/lightbox_phone.png'>
                      <span>${hotActivityItemArray[i].Phone ?? "沒有提供電話號碼"}</span>
                    </div>
                  </div>
              </div>
              <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
            </div>
            </div>
          `
      }
    }

    hotActivityRow1.innerHTML = str1
    hotActivityRow2.innerHTML = str2
    lightboxContainer.innerHTML = lightboxStr
  })
  .catch(function (error) {
    console.log(error)
  })



//--------------------------------
//     hot-ScenicSpot_conatiner
//--------------------------------
const hotScenicSpotList = document.querySelector(".hot-scenic-spot_list")
axios.get(
  `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$format=JSON`,
  {
    headers: getAuthorizationHeader()
  }
)
  .then(function (response) {
    const thisData = response.data
    console.log(thisData)
    let str = ""
    let lightboxStr = ""
    let hotScenicSpotItemArray = []

    thisData.forEach(item => {
      if (item.Picture.PictureUrl1) {
        hotScenicSpotItemArray.push(item)
      }
    })
    for (let i = 0; i < 10; i++) {
      const img = document.createElement("img")
      img.src = hotScenicSpotItemArray[i].Picture.PictureUrl1

      str +=
        `
        <a class="list_card" href="#${hotScenicSpotItemArray[i].ScenicSpotID}">
          <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
          <span class="list_sapn">${hotScenicSpotItemArray[i].ScenicSpotName}</span>
          <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${hotScenicSpotItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
        </a>
        `

      lightboxStr +=
        `
          <div class="lightbox" id="${hotScenicSpotItemArray[i].ScenicSpotID}">
            <div class="lightbox_all">
              <div class="lightbox_left">
                <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                <span class="lightbox_span">${hotScenicSpotItemArray[i].ScenicSpotName}</span>
                <p class="lightbox_p">${hotScenicSpotItemArray[i].Description}</p>
                <div class="lightbox_detail">
                  <div>
                    <img src='./img/lightbox_address.png'>
                    <span>${thisData[i].Address ?? "沒有提供詳細地址"}</span>
                  </div>
                  <div>
                    <img src='./img/lightbox_phone.png'>
                    <span>${thisData[i].Phone ?? "沒有提供電話號碼"}</span>
                  </div>
                </div>
              </div>
              <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
            </div>
          </div>
        `
    }
    hotScenicSpotList.innerHTML = str
    lightboxContainer2.innerHTML = lightboxStr
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
// slides: a新增onclick事件，可滑動
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




//--------------------------------
//       hot-city_conatiner
//--------------------------------
slides.addEventListener("click", function (e) {

  //把所有原先的內容給移除掉
  hotCitySection.setAttribute("class", "display_none")
  hotActivitySection.setAttribute("class", "display_none")
  hotScenicSpotSection.setAttribute("class", "display_none")
  listSection.setAttribute("class", "display_flex")

  //上半部處理景點的資料
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${e.target.getAttribute('data-index')}?&$top=50&$format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )

    .then(function (response) {
      const thisData = response.data
      // console.log(thisData)
      let str = ""
      let lightboxStr = ""

      if (response.data.length == 0) {
        wrongPageSearchSection.classList.remove("wrong-search-page_section")
        wrongPageSearchSection.setAttribute("class", "section")
        list.classList.add("display_none")
        console.log("hi");
      } else {
        wrongPageSearchSection.classList.remove("section")
        wrongPageSearchSection.setAttribute("class", "wrong-search-page_section")
        list.classList.remove("display_none")
      }


      for (let i = 0; i < 10; i++) {
        if (thisData[i]) {
          const img = document.createElement("img")
          img.src = thisData[i].Picture.PictureUrl1
          str +=
            `
          <a class="list_card" href="#${thisData[i].ScenicSpotID}">
            <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
            <span class="list_sapn">${thisData[i].ScenicSpotName}</span>
            <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${thisData[i].Address ?? "沒有提供詳細地址"}</span></div>
          </a>
          `

          lightboxStr +=
            `
          <div class="lightbox" id="${thisData[i].ScenicSpotID}">
            <div class="lightbox_all">
              <div class="lightbox_left">
                <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                <span class="lightbox_span">${thisData[i].ScenicSpotName}</span>
                <p class="lightbox_p">${thisData[i].DescriptionDetail}</p>
                <div class="lightbox_detail">
                  <div>
                    <img src='./img/lightbox_address.png'>
                    <span>${thisData[i].Address ?? "沒有提供詳細地址"}</span>
                  </div>
                  <div>
                    <img src='./img/lightbox_phone.png'>
                    <span>${thisData[i].Phone ?? "沒有提供電話號碼"}</span>
                  </div>
                </div>
              </div>
              <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
            </div>
          </div>
        `
        }
      }

      newList.innerHTML = str
      listH2.innerHTML = `${e.target.getAttribute('data-string')}景點`
      lightboxContainer.innerHTML = lightboxStr
    })
    .catch(function (error) {
      console.log(error)
    })

  //下半部處理活動的資料
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/${e.target.getAttribute('data-index')}?&$top=50&$format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )

    .then(function (response) {
      const thisData = response.data
      // console.log(thisData)
      let str = ""
      let lightboxStr = ""

      if (response.data.length == 0) {
        wrongPageSearchSection.classList.remove("wrong-search-page_section")
        wrongPageSearchSection.setAttribute("class", "section")
        list.classList.add("display_none")
        console.log("hi");
      } else {
        wrongPageSearchSection.classList.remove("section")
        wrongPageSearchSection.setAttribute("class", "wrong-search-page_section")
        list.classList.remove("display_none")
      }

      for (let i = 0; i < 10; i++) {
        if (thisData[i]) {
          const img = document.createElement("img")
          img.src = thisData[i].Picture.PictureUrl1
          str +=
            `
          <a class="list_card" href="#${thisData[i].ActivityID}Activity">
            <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
            <span class="list_sapn">${thisData[i].ActivityName}</span>
            <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${thisData[i].Address ?? "沒有提供詳細地址"}</span></div>
          </a>
          `

          lightboxStr +=
            `
          <div class="lightbox" id="${thisData[i].ActivityID}Activity">
            <div class="lightbox_all">
              <div class="lightbox_left">
                <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                <span class="lightbox_span">${thisData[i].ActivityName}</span>
                <p class="lightbox_p">${thisData[i].Description}</p>
                <div class="lightbox_detail">
                  <div>
                    <img src='./img/lightbox_time.png'>
                    <span>${thisData[i].StartTime.substring(0, 10)} ~ ${thisData[i].EndTime.substring(0, 10)}</span>
                  </div>
                  <div>
                    <img src='./img/lightbox_address.png'>
                    <span>${thisData[i].Address ?? "沒有提供詳細地址"}</span>
                  </div>
                  <div>
                    <img src='./img/lightbox_phone.png'>
                    <span>${thisData[i].Phone ?? "沒有提供電話號碼"}</span>
                  </div>
                </div>
              </div>
              <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
            </div>
          </div>
        `
        }
      }
      newList2.innerHTML = str
      listH22.innerHTML = `${e.target.getAttribute('data-string')}活動`
      lightboxContainer2.innerHTML = lightboxStr
    })
    .catch(function (error) {
      console.log(error)
    })
})