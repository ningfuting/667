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
  //搜索
  $(".search-place-btn").click(function(){
    query.getSearch();
  });
  $(".search-place-input").keyup(function(event){
    if (event.keyCode == 13) {
      query.getSearch();
    　}
  });
  //数据类型切换
  $(".nav-item").click(function(){
    $(this).addClass('clicked').siblings().removeClass('clicked');
    $(this).find('img').attr('src', `../images/${$(this).find('img').attr('class')}-2.png`);
    $(this).siblings().find('img').each(function(){
      $(this).attr('src',`../images/${$(this).attr('class')}.png`)
    });
    let table = $(this).attr('data-table');
    $('.result-table tbody').attr('class', table);
    $(`.result-table thead .${table}`).show().siblings().hide();
    query.getCount();
  })
  // 翻页
  // 首页
  $("#start").click(function () {
    $("#prevpage").addClass("disabled")
    $("#start").addClass("disabled")
    $("#currentPage").val(1);
    if ($("#totalPage").text() != 1) {
      $("#nextpage").removeClass("disabled")
      $("#end").removeClass("disabled")
    }
    query.getTable();
  })
  //上一页
  $("#prevpage").click(function () {
    var currentPage = $("#currentPage").val();
    $("#currentPage").val(--currentPage);
    if (currentPage == 1) {
      $("#prevpage").addClass("disabled")
      $("#start").addClass("disabled")
    };
    if (currentPage != $("#totalPage").text()) {
      $("#nextpage").removeClass("disabled")
      $("#end").removeClass("disabled")
    };
    query.getTable();
  })
  //下一页
  $("#nextpage").click(function () {
    var currentPage = $("#currentPage").val();
    $("#currentPage").val(++currentPage);
    if (currentPage != 1) {
      $("#prevpage").removeClass("disabled")
      $("#start").removeClass("disabled")
    };
    if (currentPage == $("#totalPage").text()) {
      $("#nextpage").addClass("disabled")
      $("#end").addClass("disabled")
    };
    query.getTable();
  })
  // 尾页
  $("#end").click(function () {
    $("#nextpage").addClass("disabled")
    $("#end").addClass("disabled")
    var currentPage = $("#totalPage").text();
    $("#currentPage").val(currentPage);
    if ($("#totalPage").text() != 1) {
      $("#prevpage").removeClass("disabled")
      $("#start").removeClass("disabled")
    }
    query.getTable();
  })
  //输入某一页
  $("#currentPage").keyup(function (event) {
    var code = event.which || window.event;
    if (code == 13) {
      var input = parseInt($(this).val());
      var total = parseInt($("#totalPage").text());
      if (0 < input && input <= total) {
        query.getTable()
      } else {
        $(".alert-info").show();
        $(".alert-info span").html("请输入正确的页码！");
        setTimeout(function () {
          $(".alert-info").hide();
        }, 2000);
        return false;
      }
      $("#prevpage").removeClass("disabled");
      $("#nextpage").removeClass("disabled");
      $("#start").removeClass("disabled");
      $("#end").removeClass("disabled");
      if (input == 1) {
        $("#prevpage").addClass("disabled");
        $("#start").addClass("disabled");
      }
      if (input == total) {
        $("#nextpage").addClass("disabled");
        $("#end").addClass("disabled");
      }
    }
  })

})
var map;
var buoyLayer;//浮标图层
var overlay;// 弹窗
var stations_id; // 浮标id
var init = function () {
  initMap();
  scroll('.result-table');
}
//地图
var initMap = function () {
  //底图
  var baseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    }),
    name: "required",
  });
  //浮标图层
  buoyLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        src: '../images/fubiao.png'
      })
    })
  })

  map = new ol.Map({
    layers: [baseLayer, buoyLayer],
    view: new ol.View({
      center: [104.5602,32.4070],  //ol.proj.transform([104.5602,32.4070],'EPSG:4326','EPSG:3857')
      projection: "EPSG:4326",
      zoom: 4,
    }),
    target: 'mapContent',
    controls: ol.control.defaults({
      zoom: false,
      attribution: false,
    }),
  });
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
  
  //弹窗
  var closer = document.getElementById('popup-closer');
  var container = document.getElementById('popup');
  overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
      element: container,
      autoPan: true,
      //positioning:"bottom-left",
      offset:[-20, -230],
      autoPanAnimation: {
          duration: 250
      }
  }));
  map.addOverlay(overlay);
  closer.onclick = function() {
      container.style.display = 'none';
      overlay.setPosition(undefined);
      closer.blur();
      return false;
  };

  map.on('singleclick', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
    });//判断当前单击处是否有要素，捕获到要素时弹出popup
    if(feature !== undefined){
      $("#tbody-init").hide();
      $("#tbody-none").hide();
      var coordinate = evt.coordinate;
      var properties = feature.getProperties();
      $("#properties-name").val(properties.name || '暂无');
      $("#properties-type").val(properties.type || '暂无');
      $("#properties-owner").val(properties.owner || '暂无');
      $("#properties-lng").val(feature.getGeometry().getCoordinates()[0]);
      $("#properties-lat").val(feature.getGeometry().getCoordinates()[1]);
      if(overlay){
        overlay.setPosition(coordinate);
        container.style.display = 'block';
        stations_id = properties.id;
        query.getCount();
      }
    }else{
      $(closer).click();
     } 
  });
}
//滚动条
var scroll = function(selector) {
  $(selector).mCustomScrollbar({
    axis: "y",
    scrollButtons: {
      enable: true, //设置是否显示按钮

    }, //箭头是否显示
    theme: "dark-thin",  
    scrollbarPosition: "outside", //滚动线的位置，在容器内部还是外部 inside(default)|outside
    autoHideScrollbar: true,
    autoExpandScrollbar: true,
  });
}
//查询
var query = {
  // 查询等待效果
  queryWait: function (text) {
    //加载花瓣
    var opts = {
      lines: 12, // 花瓣数目
      length: 4, // 花瓣长度
      width: 2, // 花瓣宽度
      radius: 5, // 花瓣距中心半径
      corners: 0.5, // 花瓣圆滑度 (0-1)
      rotate: 0, // 花瓣旋转角度
      direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
      color: "#d9d9d9", // 花瓣颜色
      speed: 1, // 花瓣旋转速度
      trail: 30, // 花瓣旋转时的拖影(百分比)
      shadow: false, // 花瓣是否显示阴影
      hwaccel: false, //spinner 是否启用硬件加速及高速旋转
      className: "spinner", // spinner css 样式名称
      zIndex: 2e9, // spinner的z轴 (默认是4000000000)
      top: "0px", // spinner 相对父容器Top定位 单位 px
      left: "0px", // spinner 相对父容器Left定位 单位 px
    };
    var spinner = new Spinner(opts);

    var target = $("#spin").get(0);
    spinner.spin(target);
    $(".alert-query").modal("show");
    $("#alert-text").html(text)
  },
  //获取浮标id
  getSearch: function(){
    buoyLayer.getSource().clear();
    $("#popup-closer").click();
    let searchinput = $(".search-place-input").val().replace(/(^\s*)|(\s*$)/g, "");
    if (searchinput != "") {
      let temp = searchinput.split(/[\n\s+；;，,]/g);
      temp = temp.filter(val => val !== "")
      temp = temp.join("|");
      searchinput = temp;
    }
    if(!searchinput) {
      $(".alert-info").show();
      $(".alert-info span").html("请输入浮标名称或类型！");
      setTimeout(function () {
        $(".alert-info").hide();
      }, 2000);
      return false;
    }
    $.ajax({
      type: "GET",
      url: "http://" + config.ip + config.port + config.stations + "?" + "param1=" + searchinput + "&param2=" + searchinput,
      success: function (data) {
        let res = data.features;
        if(res.length){
            // data = JSON.parse(data);
            let format = new ol.format.GeoJSON();
            buoyLayer.getSource().addFeatures(format.readFeatures(data));
            $(".result-table tbody").html('');
            $("#tbody-init").show();
            $("#tbody-none").hide();
        }else{
          $(".result-table tbody").html('');
          $("#tbody-init").hide();
          $("#tbody-none").show();
          $(".alert-info").show();
          $(".alert-info span").html("没有查到相关的数据！");
          setTimeout(function () {
            $(".alert-info").hide();
          }, 2000);
        } 
      },
      error: function () {
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询失败！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
      }
    });
  },
  //获取浮标坐标
  getCoord: function(param, properties){
    $.ajax({
      type: "GET",
      url: "http://" + config.ip + config.port + config.query + "?" + "stations_id=" + param + "&table=stations_info&resultType=geodetails",
      success: function (data) {
        if(data.features){
          query.setProperties(data, properties)
        }
      },
      error: function () {
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询失败！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
      }
    });
  },
  //设置详细信息
  setProperties: function(data, properties){
    let feature = new ol.Feature({geometry:new ol.geom.Point([data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]])});
    feature.setProperties(properties)
    buoyLayer.getSource().addFeature(feature)
  },
  //查询总数
  getCount: function(){
   // stations_id = '41001';
    if(!stations_id) return false;
    query.queryWait("正在查询...")
    let table = $(".nav .clicked").attr('data-table');
    let stationParam =  `&stations_id=${stations_id}`;
    if(table === 'stations_height_data'){
      stationParam =  `&station_id=${stations_id}`;
      Promise.all([
        $.ajax({
          type: 'GET',
          url: "http://" + config.ip + config.port + config.query + "?" + "table=" + table +"&resultType=geodetails&geoformat=count" + stationParam,
        }),
        $.ajax({
          type: 'GET',
          url: "http://" + config.ip + config.port + config.query + "?" + "table=stations_spec_wave_data&resultType=geodetails&geoformat=count" + stationParam,
        }),
      ]).then(data => {
        let count = data[0].count > data[1].count ? data[0].count : data[1].count;
        query.getPage(count);
        if(count){
          query.getTable(stations_id);
        }else{
         $(".alert-query").modal("hide");
         $(".result-table tbody").html('');
         $("#tbody-none").show();
         $("#tbody-init").hide();
        }
      }, error => {
        $(".alert-query").modal("hide");
        $(".alert-danger").modal("show");
          $(".alert-danger span").html("查询失败！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
      })
    }else{
      $.ajax({
        type: "GET",
        url: "http://" + config.ip + config.port + config.query + "?" + "table=" + table +"&resultType=geodetails&geoformat=count" + stationParam,
        success: function (data) {
           query.getPage(data.count);
           if(data.count){
             query.getTable(stations_id);
           }else{
            $(".alert-query").modal("hide");
            $(".result-table tbody").html('');
            $("#tbody-none").show();
            $("#tbody-init").hide();
           }
        },
        error: function () {
          $(".alert-query").modal("hide");
          $(".alert-danger").modal("show");
          $(".alert-danger span").html("查询失败！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
        }
      });
    }
    
  },
  //初始化页码
  getPage: function (count) {
    $("#nextpage").removeClass("disabled");
    $("#prevpage").removeClass("disabled");
    $("#start").removeClass("disabled");
    $("#end").removeClass("disabled");
    $("#currentPage").val(1);
    let totalPage = Math.ceil(count / 12);
    $("#prevpage").addClass("disabled")
    $("#start").addClass("disabled");
    if (count <= 12) {//当总数没有一页要求数量
      $("#nextpage").addClass("disabled");
      $("#end").addClass("disabled");
    }
    $("#totalPage").html(totalPage);
  },
  //获取表格内容
  getTable: function(){
    query.queryWait("正在查询...")
    let table = $(".nav .clicked").attr('data-table');
    let stationParam =  `&stations_id=${stations_id}`;
    if(table === 'stations_height_data'){
      stationParam =  `&station_id=${stations_id}`;
    }
    let currentPage = $("#currentPage").val();
    let pageFrom = (currentPage - 1) * 12 + 1;
    let pageTo = currentPage * 12;
    let page = `&from=${pageFrom}&to=${pageTo}`;
    if(table === "stations_meteorologicals" || table === 'stations_spectral_wave'){
      $.ajax({
        type: "GET",
        url: "http://" + config.ip + config.port + config.query + "?" + "table=" + table +"&resultType=geodetails" + stationParam + page,
        success: function (data) {
           query.tableInner(data.features)
        },
        error: function () {
          $(".alert-danger").modal("show");
          $(".alert-danger span").html("查询失败！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
        }
      });
    }else{
      Promise.all([
        $.ajax({
          type: 'GET',
          url: "http://" + config.ip + config.port + config.query + "?" + "table=" + table +"&resultType=geodetails" + stationParam + page,
        }),
        $.ajax({
          type: 'GET',
          url: "http://" + config.ip + config.port + config.query + "?" + "table=stations_spec_wave_data&resultType=geodetails" + stationParam + page,
        }),
      ]).then(data => {
         let features_1 = data[0].features;
         let features_2 = data[1].features;
         let features = [];
         if(features_1.length >= features_2.length){
            features_1.forEach((val, index) => {
            let add_properties = features_2[index] ? features_2[index].properties : {};
            if(add_properties){
              for( let key in add_properties){
                if(key === 'height'){
                  add_properties['height_2'] = add_properties[key];
                  delete add_properties[key];
                }
              }
            }
            Object.assign(val.properties, add_properties);
            features.push(val);
           })
         }else{
          features_2.forEach((val, index) => {
            let add_properties = features_1[index] ? features_2[index].properties : {};
            if(add_properties){
              for( let key in add_properties){
                if(key === 'height'){
                  add_properties['height_2'] = add_properties[key];
                  delete add_properties[key];
                }
              }
            }
            Object.assign(val.properties, add_properties);
            features.push(val);
           })
         }
         query.tableInner(features)
      }, error => {
        $(".alert-danger").modal("show");
          $(".alert-danger span").html("查询失败！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
      })
    }
  },
  tableInner: function(features){
    let table = $(".nav .clicked").attr('data-table');
    let inner = '';
    if(table === 'stations_meteorologicals'){
      features.forEach(ele => {
        let WDIR = ele.properties.WDIR || '暂无';
        let WSPD = ele.properties.WSPD || '暂无';
        let WVHT = ele.properties.WVHT || '暂无';
        let ATMP = ele.properties.ATMP || '暂无';
        let MWD = ele.properties.MWD || '暂无';
        inner += `<tr>`+
                  `<td>${WDIR}</td>`+
                  `<td>${WSPD}</td>`+
                  `<td>${WVHT}</td>`+
                  `<td>${ATMP}</td>`+
                  `<td>${MWD}</td>`+
                 `</tr>`
      })
    }else if(table === 'stations_spectral_wave'){
      features.forEach(ele => {
        let depth = ele.properties.depth || '暂无';
        let turb = ele.properties.turb || '暂无';
        let cond = ele.properties.cond || '暂无';
        let ph = ele.properties.ph || '暂无';
        let otmp = ele.properties.otmp || '暂无';
        let zerotwo = ele.properties.zerotwo || '暂无';
        let clcon = ele.properties.clcon || '暂无';
        inner += `<tr>`+
                  `<td>${depth}</td>`+
                  `<td>${turb}</td>`+
                  `<td>${cond}</td>`+
                  `<td>${ph}</td>`+
                  `<td>${otmp}</td>`+
                  `<td>${zerotwo}</td>`+
                  `<td>${clcon}</td>`+
                 `</tr>`
      })
    }else{
      features.forEach(ele => {
        let t = ele.properties.t || '暂无';
        let height = ele.properties.height || '暂无';
        let height_2 = ele.properties.height_2 || '暂无';
        let bandwidth = ele.properties.bandwidth || '暂无';
        let freq = ele.properties.freq || '暂无';
        let bands = ele.properties.bandwidth || '暂无';
        inner += `<tr>`+
                  `<td>${t}</td>`+
                  `<td>${height}</td>`+
                  `<td>${height_2}</td>`+
                  `<td>${bandwidth}</td>`+
                  `<td>${freq}</td>`+
                  `<td>${bands}</td>`+
                 `</tr>`
      })
    }
    $(".result-table tbody").html(inner);
    $(".result-table tbody").show();
    $("#tbody-none").hide();
    $("#tbody-init").hide();
    $(".alert-query").modal("hide");
  }
}
 