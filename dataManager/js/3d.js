$(function () {
  init();
  // 右侧列表伸缩
  $("body").on("click", ".menu-button", function () {
    if ($("#mapContent").hasClass("content-shrink")) {
      $(".menu-result ").animate({ right: '-25%' });
      $("#mapContent").removeClass("content-shrink").addClass("content-extend");
      $(".map-toolbar").css("right", "20px");
      $(this).find("img").attr("src", "../images/left.png");
    } else {
      $(".menu-result ").animate({ right: '0%' });
      $("#mapContent").addClass("content-shrink").removeClass("content-extend");
      $(".map-toolbar").css("right", "26%");
      $(this).find("img").attr("src", "../images/right.png");
    }
    map.updateSize();
  })
  //时间单位
  $(".time-unit img").click(function(){
    if($(this).attr('src') === '../images/select.png'){
      $(this).attr('src', '../images/select2.png');
      $(this).parent().siblings('label').find('img').attr('src', '../images/select.png');
    }else{
      $(this).attr('src', '../images/select.png');
      $(this).parent().siblings('label').find('img').attr('src', '../images/select2.png');
    }
  })
  //重置
  $("#time-reset").click(function(){
    let before = moment().subtract(12, "months").format("YYYY-MM-DD"); //当前时间的前3个月时间
    $(".timeTo").datetimepicker("setDate", new Date());
    $(".timeFrom").datetimepicker("setDate", new Date(before));
    $(".time-month").attr('src', '../images/select2.png');
    $(".time-year").attr('src', '../images/select.png');
    getTimeBetween($("#timeFrom").val(),$( "#timeTo").val(), 'month')
  })
  //确定
  $("#time-sure").click(function(){
    let type = '';
    if($(".time-year").attr('src') === '../images/select2.png'){
      type = 'year'
    }else{
      type = 'month'
    }
    getTimeBetween($("#timeFrom").val(),$( "#timeTo").val(), type)
  })
  /* 地名搜索 */
  $("#place_name").bind("keydown", function (e) {
    var event = window.event || e;
    //console.log(event.keyCode)
    // console.log(e.target.value, $(this).val())
    if (event.keyCode == 48 || event.keyCode == 8) {
      $(".search-place-list").html('')
      placeLayer.getSource().clear()
      search.pagenum = 1;
      search.from = 1;
      search.to = 10;
    } else if (event.keyCode == 13) {
      if (e.target.value.trim() != "") {
        placeLayer.getSource().clear()
        $(".search-place-list").html('');
        search.pagenum = 1;
        search.from = 1;
        search.to = 10;
        search.searchPlace(e.target.value.trim())
      } else {
        $(".search-place-list").html('')
        placeLayer.getSource().clear()
      }
    }
  })
  $("body").on("click", ".search-place-btn", function () {
    $(".search-place-list").html('');
    search.pagenum = 1;
    search.from = 1;
    search.to = 10;
    placeLayer.getSource().clear();
    if ($("#place_name").val().trim() != "") {
      search.searchPlace($("#place_name").val().trim())
    }
  })
  /* 触底更新 */
  $(".search-place-list").scroll(function () {
    placeLayer.getSource().clear()
    var scrollHeight = $(this)[0].scrollHeight;
    var scrollTop = $(this)[0].scrollTop;
    var height = $(".search-place-list").height();
    //console.log(scrollTop, height, scrollHeight)
    if (scrollTop + height >= scrollHeight && scrollHeight != 0) {
      search.pagenum++;
      search.from = (search.pagenum - 1) * 10 + 1;
      search.to = (search.pagenum) * 10
      search.searchPlace($("#place_name").val().trim())
    }
  });
  $("body").on("click", ".search-place-list li", function () {
    placeLayer.getSource().clear()
    var coordinates = $(this).attr("coordinates").split(",");
    coordinates = coordinates.map(e => parseFloat(e))
    //console.log(coordinates);
    map.getView().setCenter(coordinates);
    var feature = new ol.Feature(
      new ol.geom.Point(coordinates)
    );
    placeLayer.getSource().addFeature(feature);

  })
})
var map;
var timedb = 'osmraster' ; //oceanmap, getile, osmraster
var tileLayer;
var placeLayer;// 地名图层
var init = function () {
  dateTime();
  count.getLevel();
  count.getTotal();
  // initTotalCount();
  // initLevelCount();
  //initTimeline()
  getTimeBetween($("#timeFrom").val(),$( "#timeTo").val(), 'month');
}
//日历选择
var dateTime = function() {
  var timeFrom = $('.timeFrom').datetimepicker({
    language: 'zh-CN', //显示中文
    format: 'yyyy-mm-dd', //显示格式
    minView: "month", //设置只显示到月份
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    keyboardNavigation: true,
    startView: 2,
    showMeridian: 1,
    minuteStep: 1,
    pickerPosition: "top-right"
  }).on("changeDate", function (e) {
    $(".timeTo").datetimepicker("setStartDate", e.date)
  });
  var timeTo = $('.timeTo').datetimepicker({
    language: 'zh-CN', //显示中文
    format: 'yyyy-mm-dd', //显示格式
    minView: "month", //设置只显示到月份
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    keyboardNavigation: true,
    startView: 2,
    showMeridian: 1,
    minuteStep: 1,
    pickerPosition: "top-right"
  }).on("changeDate", function (e) {
    $(".timeFrom").datetimepicker("setEndDate", e.date)
  });
  var before = moment().subtract(12, "months").format("YYYY-MM-DD"); //当前时间的前3个月时间
  $(".timeTo").datetimepicker("setDate", new Date());
  $(".timeFrom").datetimepicker("setDate", new Date(before));
}
var getTimeBetween = function(start, end, type) {//传入的格式YYYY-MM
  var result = {};
  var s = start.split("-");
  var e = end.split("-");
  var minyear = new Date();
  var maxyear = new Date();
  minyear.setFullYear(s[0]);//开始年
  maxyear.setFullYear(e[0]);//结束年
  var curryear = minyear;
  while (curryear <= maxyear) {
      var year = curryear.getFullYear();
      result[year] = [];
      curryear.setFullYear(year + 1);
  }
  if(type === 'month'){
    var min = new Date();
    var max = new Date();
    min.setFullYear(s[0], s[1] * 1 - 1);//开始月
    max.setFullYear(e[0], e[1] * 1 - 1);//结束月
    var curr = min;
    while (curr <= max) {
        var month = curr.getMonth();
        if (month + 1 < 10) {
            var temmonth = "0" + (month + 1);
        } else {
            var temmonth = month + 1
        }
        result[moment(curr).format('YYYY')].push(temmonth)
        curr.setMonth(month + 1);
    }
  }
  var res = []
  for(let key in result){
    let year = key;
    if(type === 'year'){
      res.push(year)
    }else{
      result[key].forEach(val => {
        res.push(year+'-'+val)
      })
    }
  }
  initTimeline(res, type);
  let time = new Date(res[0]);
  time = time.getTime() / 1000;
  map ? update(time) : initMap(time)
}
var initMap = function (time) {
  $("#mapContent").children().remove();
  map = new ol.Map({
    view: new ol.View({
      zoom: 5,
      minZoom: 2,
      center: [106.51, 29.55], 
      projection: "EPSG:4326",
    }),
    target: 'mapContent',
    controls: ol.control.defaults({
      zoom: false,
      attribution: false,
    }),
  });
  update(time)
  //鼠标位置
  $(".mouse-position").children().remove();
  var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function (coord) {
      var coor = ol.coordinate.toStringHDMS(coord);
      var lat = "纬度:" + coor.substring(0, 13);
      var lon = "经度:" + coor.substring(14, coor.length);
      return lon + "&nbsp&nbsp" + lat;
    },
    projection: "EPSG:4326",
    className: "mouse-position",
    target: document.getElementById("mouse-position"),
    undefinedHTML:
      "经度:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
      "纬度:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp",
  });
  map.addControl(mousePositionControl);

  // 地名图层
  placeLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: '../images/place_point.png'
      })
    }),
    zIndex: 99
  });
  map.addLayer(placeLayer)
}
//更新瓦片图层
var update = function(time){
  if(tileLayer){
    map.removeLayer(tileLayer);
  }
  tileLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    })
  });
  map.addLayer(tileLayer);
}
//获取统计数据
var count = {
  getLevel: function(){
    let param = `?query=${timedb}ZoomCountinfo&instance=${timedb}ZoomCountinfo1&cache=${timedb}ZoomCountinfo`;
    $.ajax({
      type: 'GET',
      url: "http://" + config.ip + config.port + config.count + param,
      dataType: 'text',
      success: function(data){
        let res = JSON.parse(data);
        let features = res.features;
        let key_value = new Map();
        features.forEach(val => {
          let  zooms = val.properties.zooms;
          if(zooms.indexOf('-') !== -1){
            let key = zooms.split('-')[0];
            key_value.set(key,  {
              'name': zooms+'级',
              'value': val.properties.count,
            })
          }else{
            key_value.set(zooms, {
              'name': zooms+'级以上',
              'value': val.properties.count,
            })
          }
        })
        //排序
        let key_arr =Array.from(key_value.keys()).sort((a, b) => a - b);
        let name_value = [];
        key_arr.forEach(key => {
          name_value.push(key_value.get(key))
        })
        initLevelCount(name_value)
      },
      error: function(data){
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询统计信息失败！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
        
      }
    })
  },
  getTotal: function(){
    let param = `?query=${timedb}Timecount&instance=${timedb}Timecount1&cache=${timedb}Timecount`;
    $.ajax({
      type: 'GET',
      url: "http://" + config.ip + config.port + config.count + param,
      dataType: 'text',
      success: function(data){
        let res = JSON.parse(data);
        let features = res.features;
        let obj = {};
        for(let i = 6; i > 0; i--){
          let before = moment().subtract(i, "months").format("YYYYMM");  
          obj[before] = 0;
        }
        features.forEach(val => {
          let key = val.properties.months;
          obj[key] = val.properties.count;
        })
        let months = [];
        let count_data = [];
        for(let key in obj){
          months.push(key.substring(0,4)+'-'+ key.substring(4));
          count_data.push(obj[key]);
        }
        initTotalCount(months, count_data)
      },
      error: function(data){
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询统计信息失败！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
        
      }
    })
  }
}

var initTotalCount = function (months, count_data) {
  var option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top:10,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data:months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        data: count_data
      },
    ]
  };
  var totalCountChart = echarts.init(document.getElementById('totalCount'));
  totalCountChart.setOption(option);
  window.addEventListener('resize', function(){
    totalCountChart.resize();
  })
}

var initLevelCount = function (key_value) {
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      type: "scroll",
      orient: 'horizontal',
      bottom: 0,
    },
    color : [ '#f08f60', '#f4a535', '#72dcb7', '#ed81a1'],
    series: [
      {
        name: '瓦片层级',
        type: 'pie',
        radius: '55%',
        center: ['50%', '40%'],
        data: key_value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  var levelCountChart = echarts.init(document.getElementById('levelCount'), 'light');
  levelCountChart.setOption(option);
  window.addEventListener('resize', function(){
    levelCountChart.resize();
  })
}

var initTimeline = function (data, type) {
  var option = {
    baseOption: {
      timeline: {
        axisType: 'category',
        // realtime: false,
        loop: true,
        // autoPlay: true,
        currentIndex: 0,
        // playInterval: 1000,
        controlStyle: {
          showPlayBtn: false
        },
        right: 0,
        data: data,
        label: {
          formatter: function (s) {
            let date = new Date(s);
            let res = type === 'year' ? date.getFullYear() : (date.getFullYear()+'-'+(date.getMonth()+1))
            return res;
          }
        }
      },
    }
  }
  var timeline = echarts.init(document.getElementById('timeline'));
  timeline.setOption(option);
  timeline.on("timelinechanged", function (e) {
    let time = new Date(data[e.currentIndex]);
    time = time.getTime() / 1000;
    update(time)
  });
  window.addEventListener('resize', function(){
    timeline.resize();
  })
}
/** 地名搜索 */
var search = {
  from: 1,
  to: 10,
  pagenum: 1,
  searchPlace: function (place_name) {
    placeLayer.getSource().clear()
    $.ajax({
      type: "GET",
      url: `http://${config.ip + config.port + config.query}?table=poinfo&resultType=details&from=${this.from}&to=${this.to}&place_nameLike=${place_name}`,
      success: function (data) {
        var list = ''
        data.features.forEach((item, index) => {
          list += `<li coordinates=${item.geometry.coordinates}>${item.properties.place_name}</li>`
        })
        $(".search-place-list").append(list);
      },
      error: function () {
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询地名失败！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
      }
    });
  }
}
//数据类型 倾斜摄影：d3tile /cesuimdem
function changeType(type){
  timedb = type;
  $("#time-reset").click();
  init();
}
window.changeType = changeType
//window.changeType('cesuimdem')