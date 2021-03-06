$(function () {
  init();
  // 左侧数据类型菜单选择
  // 一级菜单伸缩
  $("body").on("click", ".data-type-list", function () {
    var target = $(this).attr("data-target");
    if ($(target).hasClass("show")) {
      $(this).find(".dropdown-btn").attr("src", "../images/xiala.png")
    } else {
      $(this).find(".dropdown-btn").attr("src", "../images/zhankai.png")
    }
    $(".data-type-second-list").each(function () {
      //console.log($(this).attr("id"), target.slice(1))
      if ($(this).attr("id") !== target.slice(1)) {
        $(this).collapse("hide");
        $(this).prev().find(".dropdown-btn").attr("src", "../images/xiala.png")
      }
    })
  })
  // 二级菜单选择
  $("body").on("click", ".data-type-second-list div", function () {
    $(".data-type-second-list div").removeClass("clicked");
    $(this).addClass("clicked").siblings().removeClass("clicked");
    $("#reset-search").click()
    table = $(this).attr("table");
    var page = $(this).attr("page");
    // 清空地图查询结果
    $(".table-body").html("<div class=\"table-nodata\">暂无数据</div>");
    $("#total").text("--");
    $("#search-item").find(".nav-link").addClass("active");
    $("#search-result").find(".nav-link").removeClass("active");
    $(".search-item").show().siblings().hide();
    clearSelect()
    // console.log($('.mode-select [class="active"]').attr("data-mode"))
    var mode = $('.mode-select [class="active"]').attr("data-mode");
    if (mode == "list") {
      list.init();
    }
    //sessionStorage.setItem("mode", mode);
    var path = window.location.pathname;
    var start = path.lastIndexOf("\/");
    var end = path.slice(start).indexOf("\.") + start;
    var windowType = path.slice(start + 1, end);
    // if (windowType !== page) {
    //sessionStorage.setItem("table", table);
    window.location.href = `./${page}.html`;
    // }
  })

  // 右侧列表伸缩
  $("body").on("click", ".menu-button", function () {
    if ($("#mapContent").hasClass("content-shrink")) {
      $(".menu-result ").animate({
        right: '-25%'
      });
      $("#mapContent").removeClass("content-shrink").addClass("content-extend");
      $(".map-toolbar").css("right", "20px");
      $(this).find("img").attr("src", "../images/left.png");
    } else {
      $(".menu-result ").animate({
        right: '0%'
      });
      $("#mapContent").addClass("content-shrink").removeClass("content-extend");
      $(".map-toolbar").css("right", "26%");
      $(this).find("img").attr("src", "../images/right.png");
    }
    map.updateSize();
  })
  // 列表和地图模式切换
  $("body").on("click", ".mode-select button", function () {
    $(this).addClass("active").siblings().removeClass("active");
    var mode = $(this).attr("data-mode");
    //sessionStorage.setItem("mode", mode);
    if (mode == "list") {
      $(".list-content").show();
      $(".map-content").hide();
      $(this).find("img").attr("src", "../images/liebiao2.png");
      $(this).siblings().find("img").attr("src", "../images/ditu.png");
      list.query.clear();
      list.init();
    } else {
      $(".list-content").hide();
      $(".map-content").show();
      $(this).find("img").attr("src", "../images/ditu2.png");
      $(this).siblings().find("img").attr("src", "../images/liebiao.png");
      $("#reset-search").click();
      $("#search-item").click();
      $("#current-select").text('--');
      $(".selectAll").attr('src', '../images/checknew.png');
      $(".result-table .table-head .check img").attr('src', '../images/checknew.png');
      $(".result-table .table-body").html('');
      $("#currentPage").val('');
      $("#totalPage").text('');
      $("#total").text('--');
      $("#current-select").text('--');
      $("#reset").click();
    }
    map.updateSize();
  })
  // 查询条件 / 查询结果 切换
  $("body").on("click", ".nav-item", function () {
    var id = $(this).attr("id");
    $("." + id).show().siblings().hide();
    $(this).find(".nav-link").addClass("active").parent().siblings().find(".nav-link").removeClass("active")
  })

  /* 影像数据参数配置操作 */
  // 选择某一大类-卫星代号
  $(".ps-check").click(function () {
    if ($(this).find("img").length == 0 || $(this).find("img").attr("src") != "../images/selectAll2.png") {
      $(this).html("<img src='../images/selectAll2.png'></img>");
      $(this).parent().next().find('img').attr("src", "../images/checknew2.png");
    } else {
      $(this).html("");
      $(this).parent().next().find('img').attr("src", "../images/checknew.png");
    }
  })
  // 点击单个卫星代号
  $(".ps-item").on("click", "img", function () {
    if ($(this).attr("src") == "../images/checknew.png") {
      $(this).attr("src", "../images/checknew2.png");
    } else {
      $(this).attr("src", "../images/checknew.png");
    }
    var length = $(this).parent().parent().parent().parent().parent().find('img').length;
    var currentSelect = 0
    $(this).parent().parent().parent().parent().parent().find('img').each(function () {
      if ($(this).attr("src") == "../images/checknew2.png") {
        currentSelect++;
      }
    })
    if (currentSelect > 0) {
      if (currentSelect == length) {
        $(this).parent().parent().parent().parent().parent().parent().parent().parent().find(".ps-check").html(
          "<img src='../images/selectAll2.png'></img>"
        );
      } else {
        $(this).parent().parent().parent().parent().parent().parent().parent().parent().find(".ps-check").html(
          "<img src='../images/part2.png'></img>"
        );
      }
    } else {
      $(this).parent().parent().parent().parent().parent().parent().parent().parent().find(".ps-check").html("");
    }
  })

  //查询
  $("#query").click(function () {
    query.getCount();
  })
  //重置查询条件
  $("#reset-search").click(function () {
    $("form input[type=text]").val("");
    $(".search-ps-content form img").attr("src", "../images/checknew.png");
    $(".ps-check").html("");
    $("#resolution").bootstrapSlider("setValue", 5);
    $("#resolutionSliderVal").text(5);
    clearDraw();
    let before = moment().subtract(36, "months").format("YYYY-MM-DD");
    $(".timeTo").datetimepicker("setDate", new Date());
    $(".timeFrom").datetimepicker("setDate", new Date(before));
  })

  /* 查询结果翻页操作 */
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

  /* 查询结果-表格操作 */
  // 排序
  $(".asc-desc img").click(function () {
    if ($(this).siblings().css("visibility") == "visible") {
      $(this).siblings().css("visibility", "hidden");
      $(".asc-desc img").not($(this).siblings('img')).css("visibility", "visible");
    } else {
      $(this).css("visibility", "hidden");
      $(this).siblings().css("visibility", "visible");
    }
    query.getTable();
  });
  //表格行滑过
  $(".table-body").on("mouseenter", "tr", function () {
    $(this).css("color", "#1da3ff");
    let uuid = $(this).attr("uuid");
    let pro = table === 'sentryimage' ? 'id' : 'uuid';
    pageLayer.getSource().getFeatures().forEach(function (feature) {
      if (feature.getProperties()[pro] == uuid) {
        feature.setStyle(
          new ol.style.Style({
            fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
              color: "rgba(241, 145, 145, 0)"
            }),
            stroke: new ol.style.Stroke({ //边界样式
              color: 'rgba(255, 255, 0)',
              width: 2
            }),
            zIndex: 99
          })
        )
      }
    })
  })
  $(".table-body").on("mouseleave", "tr", function () {
    $(this).css("color", "#555555");
    let uuid = $(this).attr("uuid");
    let pro = table === 'sentryimage' ? 'id' : 'uuid';
    pageLayer.getSource().getFeatures().forEach(function (feature) {
      if (feature.getProperties()[pro] == uuid) {
        feature.setStyle(
          new ol.style.Style({
            fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
              color: "rgba(241, 145, 145, 0)"
            }),
            stroke: new ol.style.Stroke({ //边界样式
              color: '#8283FF',
              width: 2
            }),
          })
        )
      }
    })
  })
  //表格选择一行
  $(".table-body").on("click", "img.check", function (event) {
    event.stopPropagation();
    let uuid = $(this).parent().parent().attr("uuid");
    let filepath = $(this).parent().parent().attr("filepath");
    let dbpath = $(this).parent().parent().attr("dbpath");
    if ($(this).attr("src") == "../images/checknew.png") {
      $(this).attr("src", "../images/checknew2.png");
      let selectPage = true;
      $(".table-body img.check").each(function () {
        if ($(this).attr("src") == "../images/checknew.png") {
          selectPage = false;
        }
      })
      if (selectPage) {
        $(".table-head .check img").attr("src", "../images/checknew2.png");
      }
      select(true, uuid, filepath, dbpath)
      if (currentSelect.uuid.length == parseInt($("#total").text())) {
        $(".selectAll").attr("src", "../images/checknew2.png");
      }
    } else {
      $(this).attr("src", "../images/checknew.png");
      $(".selectAll").attr("src", "../images/checknew.png");
      $(".table-head .check img").attr("src", "../images/checknew.png");
      select(false, uuid, filepath, dbpath)
    }
  })
  //表格选择一页
  $(".table-head .check img").click(function () {
    let isSelectPage = true;
    if ($(this).attr("src") == "../images/checknew.png") {
      $(this).attr("src", "../images/checknew2.png");
      $(".table-body .check").attr("src", "../images/checknew2.png");
    } else {
      $(this).attr("src", "../images/checknew.png");
      $(".table-body .check").attr("src", "../images/checknew.png");
      $(".selectAll").attr("src", "../images/checknew.png");
      isSelectPage = false;
    }
    $(".table-body tr").each(function () {
      select(isSelectPage, $(this).attr("uuid"), $(this).attr("filepath"), $(this).attr('dbpath'))
    })
    if (currentSelect.uuid.length == parseInt($("#total").text())) {
      $(".selectAll").attr("src", "../images/checknew2.png");
    }
  });
  //全选
  $(".selectAll").click(function () {
    if ($(this).attr("src") == "../images/checknew.png") {
      $(this).attr("src", "../images/checknew2.png");
      $(".table-body .check").attr("src", "../images/checknew2.png");
      $(".table-head .check img").attr("src", "../images/checknew2.png");
      $("#current-select").text($("#total").text());
      query.allSelect();
    } else {
      //清空选择
      $(this).attr("src", "../images/checknew.png");
      $(".table-body .check").attr("src", "../images/checknew.png");
      $(".table-head .check img").attr("src", "../images/checknew.png");
      currentSelect.uuid = [];
      currentSelect.filepath = [];
      currentSelect.url = [];
      $("#current-select").text("--");
    }
  })
  //导出到excel
  $("body").on("click", ".export", function () {
    if ($(".result-table .table-body tr").length != 0) {
      let content = "thead tr:nth-child(2), thead tr:nth-child(1) td:nth-child(1),tbody tr td:nth-child(1),thead tr:nth-child(1) td:nth-child(2),tbody tr td:nth-child(2)";
      if(table === 'sentryimage'){
        content = "thead tr:nth-child(1), thead tr:nth-child(2) td:nth-child(1),tbody tr td:nth-child(1),thead tr:nth-child(2) td:nth-child(2),tbody tr td:nth-child(2)";
      }
      $(".result-table").table2excel({
        exclude: content,
        name: "Excel Document Name",
        filename: "excel_currentpage" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        excluede_inputs: true
      })
    } else {
      $(".alert-info").show();
      $(".alert-info span").html("当前暂无数据！");
      setTimeout(function () {
        $(".alert-info").hide();
      }, 2000);
    }
  });
  $("body").on("click", ".download", function () {
    console.log(currentSelect)
    if (currentSelect.uuid.length != 0) {
      var inner = '';
      if(table !== 'sentryimage'){
        for (var i = 0; i < currentSelect.uuid.length; i++) {
          var lastIndex = currentSelect.filepath[i].lastIndexOf("\/");
          var title = currentSelect.filepath[i].substring(lastIndex + 1);
          inner += `<div style="clear:both;height:35px">
                        <span title=${title} class="downName" uuid=${currentSelect.uuid[i]}>${title}</span>
                        <span class="downStatus"></span>
                      </div>`;
        }
        $("#downloadList").show();
        $(".downTableContent").html(inner);
      }else{
        for (var i = 0; i < currentSelect.uuid.length; i++) {
          var lastIndex = currentSelect.filepath[i].lastIndexOf("\/");
          var title = currentSelect.filepath[i].substring(lastIndex + 1);
          var url = currentSelect.url[i];
          inner += `<div style="clear:both;height:35px">
                        <span title=${title} class="downName" uuid=${currentSelect.uuid[i]}>${title}</span>
                        <span class="downStatus"><a href="${url}">下载</a></span>
                      </div>`;
        }
        $("#downloadList").show();
        $(".downTableContent").html(inner);
        $("#downTableContent").mCustomScrollbar('destroy');
        scroll("#downTableContent", "dark-thin")
      }
      if(table !== 'sentryimage'){
        for (var i = 0; i < currentSelect.uuid.length; i++) {
          download(currentSelect.uuid[i]);
        }
      }
    } else {
      $(".alert-info").show();
      $(".alert-info span").html("请选择数据！");
      setTimeout(function () {
        $(".alert-info").hide();
      }, 2000);
    }
  })
  $("#closeDownloadList").click(function () {
    $("#downloadList").hide()
  })


  //查看影像
  $(".table-body").on("click", "img.view-quickview", function (event) {
    event.stopPropagation(); //阻止冒泡
    let uuid = $(this).parent().parent().attr("uuid");
    if ($(this).attr("src") == "../images/view.png") {
      $(this).attr("src", "../images/view2.png");
      isAddImage(true, uuid)
    } else {
      $(this).attr("src", "../images/view.png");
      isAddImage(false, uuid)
    }
  })
  // 查看全图
  $(".table-body").on("click", "img.view-wmts", function (event) {
    event.stopPropagation(); //阻止冒泡
    let filepath = $(this).parent().parent().attr("filepath");
    let rootpath = $(this).parent().parent().attr("rootpath");
    var isdb = $(this).parent().parent().attr("isdb");
    diskpath = rootpath ? rootpath + filepath : filepath;
    previewMap(diskpath, "none", isdb);
    $("#layerInfo").collapse("hide");
  })
  // 关闭全图窗口
  $("#closePreiview").click(function () {
    $(".previewMap").hide();
    $('[name="status"]').bootstrapSwitch('state', false);
  })
  // 全图窗口放大缩小
  $("body").on("click", ".reshape", function () {
    if ($(this).hasClass("big")) {
      $(".previewMap").css({
        "width": "100%",
        "height": '100%',
        "top": "0",
        "left": "0",
      });
    } else if ($(this).hasClass("small")) {
      $(".previewMap").css({
        "width": "80%",
        "height": '85%',
        "top": "90px",
        "left": "10%"
      });
    }
    $(this).addClass("hide").siblings(".reshape").removeClass("hide");
  });

  // 全图切片
  $("#drawdownload").click(function () {
    drawBox()
  })

  /* 地名搜索 */
  $("#place_name").bind("keydown", function (e) {
    var event = window.event || e;
    // console.log(event.keyCode)
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
      // console.log("daodile", search.pagenum)
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

  /*---------------------------列表模式--------------------------- */
  //矩形和圆
  $(".input-lnglat-menu .nav-item").click(function () {
    $(this).addClass('clicked').siblings().removeClass('clicked');
    if ($(this).attr('id') === 'list-rect-select') {
      $(".list-rect").show();
      $(".list-circle").hide();
      $(".list-circle input[type=text]").val('');
    } else {
      $(".list-rect").hide();
      $(".list-circle").show();
      $(".list-rect input[type=text]").val('')
    }
  })
  //点击表格行展示详细信息
  $(".list-search-table tbody").on("click", "tr", function () {
    $(".list-details-text div").find("span").not(".list-details-subTitle").text("");
    $(this).addClass("showed").siblings().removeClass("showed");
    let json = $(this).attr('data-feature');
    json = JSON.parse(json);
    for (let key in json) {
      if (key === 'quickview') {
        let quickview = json.quickview;
        $(".list-details-picture img").attr('src', quickview);
      } else if (key === "coord") {
        let coord = json.coord;
        minimap_vectorLayer.getSource().clear();
        if(coord !== '暂无'){
          let feature = new ol.Feature(new ol.geom.Polygon(JSON.parse(coord)))
          minimap_vectorLayer.getSource().addFeature(feature);
          minimap.getView().fit(feature.getGeometry().getExtent(), minimap.getSize(), {
            padding: [150, 150, 150, 150],
            constrainResolution: false
          });
        }
      } else {
        $(`.details-${key}`).text(json[key]);
        if (key === 'title') {
          $(`.details-${key}`).attr("title", json[key])
        }
      }
      if (key === "zippath") {
        json.zippath ? $("#downOrigin").css("visibility", "visible").attr("zippath", json.zippath) : $("#downOrigin").css("visibility", "hidden")
      }
    }
    $(".list-details-text div").find("span").not(".list-details-subTitle").each(function () {
      // console.log(this)
      if ($(this).text() == "") {
        $(this).parent().hide()
      } else {
        $(this).parent().show()
      }
    })
    let filepath = json.rootpath ? json.rootpath + json.filepath : json.filepath;
    $("#list-totalmap").attr('filepath', filepath);
    $("#list-totalmap").attr('isdb', json.isdb);
  })
  // HZ原始数据下载
  $("#downOrigin").click(function () {
    var zippath = $(this).attr("zippath");
    if (zippath) {
      downloadOrigin(zippath);
    }
  })

  //表格复选框
  $(".thead-all-select").click(function () {
    if ($(this).attr('src') === '../images/checknew.png') {
      $(this).attr('src', '../images/checknew2.png');
      $(".list-search-table .tbody-check").attr('src', '../images/checknew2.png');
      $(".list-search-table tbody tr").addClass("clicked");
      $(".list-search-table tbody tr").each(function () {
        let json = JSON.parse($(this).attr('data-feature'));
        let uuid = json.uuid;
        let filepath = json.filepath;
        if (!currentSelect.uuid.includes(uuid)) {
          currentSelect.uuid.push(uuid);
          currentSelect.filepath.push(filepath);
          if(table === 'sentryimage'){
            currentSelect.url.push(json.tifpath);
          }
        }
      })
    } else {
      $(this).attr('src', '../images/checknew.png');
      $(".list-search-table .tbody-check").attr('src', '../images/checknew.png');
      $(".list-search-table tbody tr").removeClass("clicked");
      $(".list-search-table tbody tr").each(function () {
        let json = JSON.parse($(this).attr('data-feature'));
        let uuid = json.uuid;
        if (currentSelect.uuid.includes(uuid)) {
          let index = currentSelect.uuid.indexOf(uuid);
          currentSelect.uuid.splice(index, 1);
          currentSelect.filepath.splice(index, 1);
          if(table === 'sentryimage'){
            currentSelect.url.splice(index, 1);
          }
        }
      })
    }
  })
  $(".list-search-table tbody").on('click', '.tbody-check', function (event) {
    event.stopPropagation();
    let json = $(this).parent().parent().attr('data-feature');
    json = JSON.parse(json);
    let uuid = json.uuid;
    let filepath = json.filepath;
    if ($(this).attr('src') === '../images/checknew.png') {
      $(this).attr('src', '../images/checknew2.png');
      $(this).parent().parent().addClass("clicked");
      let count = 0
      $(".list-search-table tbody .tbody-check").each(function () {
        if ($(this).attr('src') === '../images/checknew2.png') {
          count++
        }
      })
      if (count == $(".list-search-table tbody tr").length) {
        $(".thead-all-select").attr('src', '../images/checknew2.png');
      }
      currentSelect.uuid.push(uuid);
      currentSelect.filepath.push(filepath);
      if(table === 'sentryimage'){
        currentSelect.url.push(json.tifpath);
      }
    } else {
      $(this).attr('src', '../images/checknew.png');
      $(this).parent().parent().removeClass("clicked");
      $(".thead-all-select").attr('src', '../images/checknew.png');
      let index = currentSelect.uuid.indexOf(uuid);
      currentSelect.uuid.splice(index, 1);
      currentSelect.filepath.splice(index, 1);
      if(table === 'sentryimage'){
        currentSelect.url.splice(index, 1);
      }
    }
  })
  //上一页
  $("#list-prevpage").click(function () {
    var currentPage = $("#list-currentPage").val();
    $("#list-currentPage").val(--currentPage);
    if (currentPage == 1) {
      $("#list-prevpage").addClass("disable")
    };
    if (currentPage != $("#list-totalPage").text()) {
      $("#list-nextpage").removeClass("disable")
    };
    list.query.getTable();
  })
  //下一页
  $("#list-nextpage").click(function () {
    var currentPage = $("#list-currentPage").val();
    $("#list-currentPage").val(++currentPage);
    if (currentPage != 1) {
      $("#list-prevpage").removeClass("disable")
    };
    if (currentPage == $("#list-totalPage").text()) {
      $("#list-nextpage").addClass("disable")
    };
    list.query.getTable();
  })
  //输入某一页
  $("#list-currentPage").keyup(function (event) {
    var code = event.which || window.event;
    if (code == 13) {
      var input = parseInt($(this).val());
      var total = parseInt($("#list-totalPage").text());
      if (0 < input && input <= total) {
        list.query.getTable()
      } else {
        $(".alert-info").show();
        $(".alert-info span").html("请输入正确的页码！");
        setTimeout(function () {
          $(".alert-info").hide();
        }, 2000);
        return false;
      }
      $("#list-prevpage").removeClass("disable");
      $("#list-nextpage").removeClass("disable");
      if (input == 1) {
        $("#list-prevpage").addClass("disable");
      }
      if (input == total) {
        $("#list-nextpage").addClass("disable");
      }
    }
  })
  //表格排序
  $(".list-asc-desc img").click(function () {
    if ($(this).siblings().css("visibility") == "visible") {
      $(this).siblings().css("visibility", "hidden");
      $(".list-asc-desc img").not($(this).siblings('img')).css("visibility", "visible");
    } else {
      $(this).css("visibility", "hidden");
      $(this).siblings().css("visibility", "visible");
    }
    list.query.getTable();
  });
  //导出到excel
  $("body").on("click", "#list-export", function () {
    // console.log($(".list-search-table tbody tr").length)
    if ($(".list-search-table tbody tr").length != 0) {
      let content =  'thead tr:nth-child(2),thead tr th:nth-child(1),tbody tr td:nth-child(1)';
      if(table === 'sentryimage'){
        content =  'thead tr:nth-child(1),thead tr th:nth-child(1),tbody tr td:nth-child(1)';
      }
      $(".list-search-table table").table2excel({
        exclude: content,
        name: "Excel Document Name",
        filename: "excel_currentpage" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        excluede_inputs: true
      })
    } else {
      $(".alert-info").show();
      $(".alert-info span").html("当前暂无数据！");
      setTimeout(function () {
        $(".alert-info").hide();
      }, 2000);
    }
  });
  //搜索
  $("#list-search-btn").click(function () {
    $("#list-search-item").collapse('hide');
    list.query.getCount();
  });
  $("#list-search-input").keydown(function (event) {
    if (event.keyCode == 13) {
      $("#list-search-item").collapse('hide');
      list.query.getCount();
    }
  });
  // 查看全图
  $("#list-totalmap").click(function () {
    diskpath = $(this).attr('filepath');
    var isdb = $(this).attr('isdb');
    previewMap(diskpath, "none", isdb);
    $("#layerInfo").collapse("hide");
  })
});
var map;
var draw;
var pan;
var drawLayer; // 绘制图册
var pageLayer; // 当前页图层
var totalLayer; // 覆盖图层
var placeLayer; //地名图层
var currentSelect = { //选择数据
  uuid: [],
  filepath: [],
  url: [],
};
var imagelayer = { //影像查看选择
  uuid: [],
};
var table = "uncooperative"; //数据类型
var mode = 'list'; //模式
var preview; //全图预览容器
var previewDrawLayer; // 切图画框
var diskpath; // 全图浏览文件路径
var interval;

var init = function () {
  // console.log(sessionStorage.getItem("table"), sessionStorage.getItem("mode"))
  // if (sessionStorage.getItem("table") != null) {
  //   table = sessionStorage.getItem("table");
  //   var parent = $('[table="' + table + '"]').parent();
  //   var parentid = $(parent).attr("id");
  //   // console.log(`#${parentid}`)
  //   $(".data-type-second-list").not(`#${parentid}`).collapse("hide")
  //   $('[table="' + table + '"]').parent().collapse("show");
  //   $(".data-type-list").each(function () {
  //     if ($(this).attr("data-target") === `#${parentid}`) {
  //       $(this).find(".dropdown-btn").attr("src", "../images/zhankai.png")
  //     } else {
  //       $(this).find(".dropdown-btn").attr("src", "../images/xiala.png")
  //     }
  //   })
  //   $(".data-type-second-list div").removeClass("clicked")
  //   $('[table="' + table + '"]').addClass("clicked")
  //   // sessionStorage.removeItem("table");
  // }
  // if (sessionStorage.getItem("mode") != null) {
  //   var mode = sessionStorage.getItem("mode")
  //   $('[data-mode="' + mode + '"]').addClass("active").siblings().removeClass("active");
  //   if (mode == "list") {
  //     $(".list-content").show();
  //     $(".map-content").hide();
  //     $('[data-mode="list"]').find("img").attr("src", "../images/liebiao2.png");
  //     $('[data-mode="list"]').siblings().find("img").attr("src", "../images/ditu.png");
  //   } else {
  //     $(".list-content").hide();
  //     $(".map-content").show();
  //     $('[data-mode="map"]').find("img").attr("src", "../images/ditu2.png");
  //     $('[data-mode="map"]').siblings().find("img").attr("src", "../images/liebiao.png");
  //   }
  // }

  dateTime();
  if (table != "") {
    list.init();
  }
  initMap();
  previewInit();
  scroll(".bottom-content", "dark-thick");
  $('[data-toggle="tooltip"]').tooltip();
  /* 分辨率滚动条 */
  $("#resolution").bootstrapSlider();
  $("#resolution").on("slide", function (slideEvt) {
    $("#resolutionSliderVal").text(slideEvt.value);
  });
  /* 全图预览图像增强开关 */
  $('[name="status"]').bootstrapSwitch({
    onText: "开",
    offText: "关",
    onColor: "info",
    offColor: "default",
    onSwitchChange: function (event, state) {
      if (state == true) {
        // console.log("1");
        var zoom = preview.getView().getZoom();
        var center = preview.getView().getCenter();
        previewMap(diskpath, "stdev", "false");
        preview.getView().setCenter(center);
        preview.getView().setZoom(zoom)
      } else {
        var zoom = preview.getView().getZoom();
        var center = preview.getView().getCenter();
        previewMap(diskpath, "none", "false");
        preview.getView().setCenter(center);
        preview.getView().setZoom(zoom)
      }
    }
  })

  drag("#downloadList")
  drag(".previewMap")
}
var initMap = function () {
  var baseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    }),
    name: "required",
  });
  pageLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(241, 145, 145, 0)"
      }),
      stroke: new ol.style.Stroke({ //边界样式
        color: '#8283FF',
        width: 2
      }),
    }),
    zIndex: 2
  });
  totalLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(227, 207, 87 , 0.5)"
      }),
      stroke: new ol.style.Stroke({ //边界样式
        color: 'rgba(227, 207, 87 , 0.5)',
        width: 2
      }),
    }),
    zIndex: 1
  });
  map = new ol.Map({
    layers: [baseLayer, pageLayer, totalLayer],
    view: new ol.View({
      center: [104.5602, 32.407], //ol.proj.transform([104.5602,32.4070],'EPSG:4326','EPSG:3857')
      projection: "EPSG:4326",
      zoom: 4,
      extent: [-180, -90, 180, 90],
    }),
    target: "mapContent",
    interactions: ol.interaction.defaults({
      doubleClickZoom: false,
    }),
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
    undefinedHTML: "经度:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
      "纬度:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp",
  });
  map.addControl(mousePositionControl);

  //绘制
  drawLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
        color: "rgba(241, 145, 145,0)"
      }),
      stroke: new ol.style.Stroke({ //边界样式
        color: 'rgba(255,0,0)',
        width: 2
      }),
    }),
    zIndex: 99,
    name: "required"
  });
  map.addLayer(drawLayer);

  //pan
  pan = getPan();
  //绘制矩形
  $("#rectangle").click(function () {
    clearDraw()
    pan.setActive(false);
    drawInteration('Box');
  })
  //绘制多边形
  $("#polygon").click(function () {
    clearDraw()
    pan.setActive(false);
    drawInteration('Polygon');
  })
  //清除绘制
  $("#cleardraw").click(function () {
    clearDraw()
  })
  //复位
  $("#reset").click(function () {
    map.getView().setZoom(4);
    map.getView().setCenter([104.5602, 32.4070])
  })
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
  });
  map.addLayer(placeLayer)
};
var previewInit = function () {
  preview = new ol.Map({
    // layers: [baseLayer],
    view: new ol.View({
      center: [0, 0],
      zoom: 3,
    }),
    target: 'previewMap',
    controls: ol.control.defaults({
      attribution: false,
      zoom: false,
    }),
  });
  var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function (coord) {
      var coor = ol.coordinate.toStringHDMS(coord);
      var lat = "纬度:" + coor.substring(0, 13);
      var lon = "经度:" + coor.substring(14, coor.length);
      return lon + "&nbsp&nbsp" + lat;
    },
    projection: "EPSG:4326",
    className: "mouse-position",
    target: document.getElementById("preview-mouse-position"),
    undefinedHTML: "经度:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
      "纬度:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp",
  });
  preview.addControl(mousePositionControl);
  preview.addInteraction(new ol.interaction.KeyboardZoom());
  preview.addInteraction(new ol.interaction.KeyboardPan());
  previewDrawLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      fill: new ol.style.Fill({ //矢量图层填充颜色，以及透明度
        color: "rgba(241, 145, 145,0)"
      }),
      stroke: new ol.style.Stroke({ //边界样式
        color: 'rgba(255,0,0)',
        width: 2
      }),
    }),
    zIndex: 99,
  });
}
// 拖拽
var getPan = function () {
  let pan;
  map.getInteractions().forEach(function (element, index, array) {
    if (element instanceof ol.interaction.DragPan) {
      pan = element;
    }
  })
  return pan;
}
//绘制
var drawInteration = function (type) {
  if (type !== "None") {
    var geometryFunction, maxPoints;
    if (type === 'Square') {
      type = 'Circle';
      geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    } else if (type === 'Box') {
      type = 'LineString';
      maxPoints = 2;
      geometryFunction = function (coordinates, geometry) {
        if (!geometry) {
          geometry = new ol.geom.Polygon(null);
        }
        var start = coordinates[0];
        var end = coordinates[1];
        geometry.setCoordinates([
          [start, [start[0], end[1]], end, [end[0], start[1]], start]
        ]);
        return geometry;
      };
    }
    draw = new ol.interaction.Draw({
      type: /** @type {ol.geom.GeometryType} */ (type), //如果是Polygon，则此处默认
      geometryFunction: geometryFunction,
      maxPoints: maxPoints,
      source: drawLayer.getSource(),
    });
    map.addInteraction(draw);

    draw.on('drawend', function (evt) {
      var geometry = evt.feature.getGeometry();
      var extent = geometry.getExtent();
      map.getView().fit(extent, map.getSize(), {
        padding: [50, 150, 50, 150]
      })
      map.removeInteraction(draw);
      pan.setActive(true);
    })
  }
}
// 清除绘制
var clearDraw = function () {
  drawLayer.getSource().clear();
  pageLayer.getSource().clear();
  totalLayer.getSource().clear();
  if (draw) {
    map.removeInteraction(draw);
    pan.setActive(true);
  }
  if (imagelayer.uuid.length) {
    imagelayer.uuid.forEach(id => {
      map.getLayers().forEach(function (layer) {
        if (layer.getProperties().name == id) {
          map.removeLayer(layer)
          return false;
        }
      })
    })
  }
}

function clearSelect() {
  $(".selectAll").attr("src", "../images/checknew.png");
  $(".table-body .check").attr("src", "../images/checknew.png");
  $(".table-head .check img").attr("src", "../images/checknew.png");
  currentSelect.uuid = [];
  currentSelect.filepath = [];
  currentSelect.url = [];
  $("#current-select").text("--");
}
//日历选择
function dateTime() {
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
    pickerPosition: "bottom-right"
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
    pickerPosition: "bottom-right"
  }).on("changeDate", function (e) {
    $(".timeFrom").datetimepicker("setEndDate", e.date)
  });
  var before = moment().subtract(36, "months").format("YYYY-MM-DD"); //当前时间的前3个月时间
  $(".timeTo").datetimepicker("setDate", new Date());
  $(".timeFrom").datetimepicker("setDate", new Date(before));
}
//滚动条
function scroll(selector, theme) {
  $(selector).mCustomScrollbar({
    // horizontalScroll:true,//横向滚动
    axis: "y",
    scrollButtons: {
      enable: true, //设置是否显示按钮

    }, //箭头是否显示
    theme: theme, //滚动条主题
    scrollbarPosition: "outside", //滚动线的位置，在容器内部还是外部 inside(default)|outside (如果容器的position是static值，则添加position:relative)
    autoHideScrollbar: true,
    //autoDraggerLength: true,//根据内容区域自动调整滚动条拖块的长度
    autoExpandScrollbar: true,
  });
}
// 拖拽设置
function drag(selector) {
  $(selector).draggable({
    handle: "div.ui-widget-header",
    addClasses: false,
    // containment: "#background",
    scroll: false
  })
}
var query = {
  //查询条件
  getSearchItem: function () {
    var param = {
      "table": table,
      "resultType": "details"
    };
    //地理范围
    if (drawLayer.getSource().getFeatures().length) {
      var feature = drawLayer.getSource().getFeatures()[0];
      var coordinates = feature.getGeometry().getCoordinates();
      coordinates = coordinates[0]
      var boundry = [];
      for (let j = 0; j < coordinates.length; j++) {
        if (feature.getProperties().ID != undefined) {
          for (let i = 0; i < coordinates[j].length; i++) {
            boundry.push(coordinates[j][i].join(" "))
          }
        } else {
          boundry.push(coordinates[j].join(" "))
        }
      }
      let polygon = "POLYGON((" + boundry.join(",").replace(/(^\s*)|(\s*$)/g, "") + "))";
      table === "sentryimage" ? param['wkt'] = polygon :  param['polygon'] = polygon;
      //param["polygon"] = "POLYGON((" + boundry.join(",").replace(/(^\s*)|(\s*$)/g, "") + "))";

    } else {
      $(".alert-info").show();
      $(".alert-info span").html("请输入查询地理范围！");
      setTimeout(function () {
        $(".alert-info").hide();
      }, 2000);
      return false;
    }

    //采集时间
    if ($("#imagetimeFrom").val() != "") {
      let timeFrom =  $("#imagetimeFrom").val().replace(/(^\s*)|(\s*$)/g, "");
      table === "sentryimage" ? param['image_dateFrom'] = timeFrom :  param['imagetimeFrom'] = timeFrom;
      //param["imagetimeFrom"] = $("#imagetimeFrom").val().replace(/(^\s*)|(\s*$)/g, "");
    }
    if ($("#imagetimeTo").val() != "") {
      let timeTo = $("#imagetimeTo").val().replace(/(^\s*)|(\s*$)/g, "");
      table === "sentryimage" ? param['image_dateTo'] = timeTo :  param['imagetimeTo'] = timeTo;
     // param["imagetimeTo"] = $("#imagetimeTo").val().replace(/(^\s*)|(\s*$)/g, "");
    }
    //分辨率
    if (parseFloat($("#resolutionSliderVal").text())) {
      param["resolutionFrom"] = 0;
      param["resolutionTo"] = parseFloat($("#resolutionSliderVal").text());
    }

    // 卫星代号
    var satelliteid = []
    var sennsorid = [];
    $(".ps-item").each(function () {
      var select = 0;
      $(this).find("img").each(function () {
        if ($(this).attr('src') == "../images/checknew2.png") {
          sennsorid.push($(this).parent().text())
          select++;
        }
      })
      if (select > 0) {
        if (satelliteid.indexOf($(this).siblings('label').text()) == -1) {
          satelliteid.push($(this).siblings('label').text())
        }
      }
    })
    if (satelliteid.length > 0) {
      param["satelliteid"] = satelliteid.join("|");
    }

    // 模糊搜索
    var searchinput = $(".search-input input").val().replace(/(^\s*)|(\s*$)/g, "");
    if (searchinput != "") {
      var temp = searchinput.split(/[\n\s+；;，,]/g);
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] == "") {
          temp.splice(i, 1);
          i--;
        }
      }
      temp = temp.join("|");
      // console.log(temp)
     // param["anytextLike"] = temp;
     table === "sentryimage" ? param['idLike'] = temp : param["anytextLike"] = temp;
    }
    // 参数对象转换成字符串
    var paramString = ``;
    for (var key in param) {
      paramString += `&${key}=${param[key]}`
    }
    paramString = `?${paramString.slice(1)}`
    // console.log(param, paramString)
    return paramString;
  },
  //获取查询总数
  getCount: function () {
    var param = query.getSearchItem();
    if (param) {
      // param["geoformat"] = "count";
      param += `&geoformat=count`
      currentSelect.uuid = [];
      currentSelect.filepath = [];
      currentSelect.url = [];
      $("#current-select").text("--");
      $.ajax({
        type: "GET",
        url: "http://" + config.ip + config.port + config.query + param,
        success: function (data) {
          //console.log(data);
          let count = data.count;
          $("#search-result").click();
          query.getPage(count);
          query.getArea();
          query.getTable();
        },
        error: function () {
          $(".alert-danger").modal("show");
          $(".alert-danger span").html("查询失败！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
        }
      });
    }
  },
  //获取覆盖范围
  getArea: function () {
    var param = query.getSearchItem();
    // param["geoformat"] = "union";
    param += `&geoformat=union`
    //console.log(JSON.stringify(param));
    totalLayer.getSource().clear();
    $.ajax({
      type: "GET",
      url: "http://" + config.ip + config.port + config.query + param,
      dataType: "text",
      success: function (data) {
        //console.log(data);
        if (data !== "") {
          data = JSON.parse(data);
          var format = new ol.format.GeoJSON();
          totalLayer.getSource().addFeatures(format.readFeatures(data));
        }
      },
      error: function (data) {
        // console.log(data);
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询失败！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
      }
    });
  },
  //获取表格和地图绘制
  getTable: function () {
    this.queryWait("正在查询...");
    //清除图层
    pageLayer.getSource().clear();
    if (imagelayer.uuid.length) {
      imagelayer.uuid.forEach(id => {
        map.getLayers().forEach(function (layer) {
          if (layer.getProperties().name == id) {
            map.removeLayer(layer)
            return false;
          }
        })
      })
    }
    imagelayer.uuid = [];
    let currentPage = $("#currentPage").val();
    let pageFrom = (currentPage - 1) * 20 + 1;
    let pageTo = currentPage * 20;
    let param = query.getSearchItem();
    param += `&from=${pageFrom}&to=${pageTo}`
    $(".asc-desc img").each(function () {
      if ($(this).css("visibility") == "hidden" && $(this).parents('tr').css('display') !== 'none') {
        let sort = $(this).siblings().attr("class").split(" ")[0];
        let sortItem = $(this).parent().parent().attr("class");
        param += `&sortBy=${sortItem}&orderBy=${sort}`
      }
    });
    $.ajax({
      type: "GET",
      url: "http://" + config.ip + config.port + config.query + param,
      success: function (data) {
        //console.log(data);
        var format = new ol.format.GeoJSON();
        pageLayer.getSource().addFeatures(format.readFeatures(data));
        var response = data.features;
        if (response.length === 0) {
          $(".table-body").html("<div class=\"table-nodata\">暂无数据</div>");
          $("#prevpage").addClass("disabled");
          $("#nextpage").addClass("disabled");
          $("#start").addClass("disabled");
          $("#nextpage").addClass("disabled");
          $(".alert-query").modal("hide");
          return false;
        }
        var row = "";
        if(table === 'sentryimage'){
          response.forEach(item => {
            let quickview = item.properties.thumbnail || "暂无";
            let resolution = item.properties.resolution || "暂无";
            let imageTime = item.properties.image_date ? item.properties.image_date.split(" ")[0] : "暂无";
            let uuid = item.properties.id;
            let title = item.properties.tifname;
            let filepath = item.properties.tifpath_path;
            let dbpath = item.properties.tifpath || "暂无";
           // let rootpath = item.properties.rootpath;
            let checkSrc = "../images/checknew.png";
            if (currentSelect.uuid.indexOf(uuid) != -1) {
              checkSrc = "../images/checknew2.png";
            }
            row += `<tr uuid="${uuid}" filepath="${filepath}" dbpath="${dbpath}"  isdb="false">
                        <td><img src="${checkSrc}" class="check" ></td>
                        <td>
                            <img src="${quickview}" class="view-wmts" />
                            <img src="../images/view.png" class="view-quickview" />
                        </td>
                        <td title="${title}">${title}</td>
                        <td>${imageTime}</td>
                        <td>${resolution}</td>
                      </tr>`
  
          })
        }else{
          response.forEach(item => {
            let quickview = item.properties.quickview || "暂无";
            let satelliteID = item.properties.describe || "暂无";
            let imageTime = item.properties.imagetime? item.properties.imagetime.split(" ")[0] : "暂无";
            let uuid = item.properties.uuid;
            let title = item.properties.title;
            let filepath = item.properties.filepath.split(";")[0];
            let rootpath = item.properties.rootpath;
            let checkSrc = "../images/checknew.png";
            if (currentSelect.uuid.indexOf(uuid) != -1) {
              checkSrc = "../images/checknew2.png";
            }
            row += `<tr uuid="${uuid}" filepath="${filepath}" rootpath="${rootpath}" isdb="false">
                        <td><img src="${checkSrc}" class="check" ></td>
                        <td>
                            <img src="${quickview}" class="view-wmts" />
                            <img src="../images/view.png" class="view-quickview" />
                        </td>
                        <td>${title}</td>
                        <td>${imageTime}</td>
                        <td>${satelliteID}</td>
                      </tr>`
  
          })
        }
        // $(".table-body").html(list);
        $(".table-body").html(row);
        // 重置表格复选框
        $(".table-head .check img").attr("src", "../images/checknew.png");
        var curSelect = 0;
        $(".table-body img.check").each(function () {
          if ($(this).attr("src") == "../images/checknew.png") {
            $(".table-head .check img").attr("src", "../images/checknew.png");
          } else {
            curSelect++;
          }
        });
        if (curSelect === response.length) {
          $(".table-head .check img").attr("src", "../images/checknew2.png");
        }
        if (currentSelect.uuid.length == parseInt($("#total").text())) {
          $(".selectAll").attr("src", "../images/checknew2.png");
        } else {
          $(".selectAll").attr("src", "../images/checknew.png");
        }
        //判断图片是否加载完成
        let flag = 0;
        $(".table-body img.view-wmts").each(function () {
          // console.log(this.complete, this.src)
          if (!this.complete) {
            var realSrc = this.src;
            $(this).attr("src", "../images/picture.png")
            $(this).on('load', function () {
              $(this).attr("src", realSrc)
            });
          }
          $(this).on("error", function (e) { //图片加载失败的情况
            $(e.target).next(".view-quickview").addClass("disabled")
            //console.log($(e.target).next().addClass("disabled"));
            // $(".alert-query").modal("hide");
            // $(".alert-danger").modal("show");
            // $(".alert-danger span").html("图片加载失败！");
            // $(this).attr("src", "../images/picture.png")
            // var timtout = setTimeout(function () {
            //   $(".alert-danger").modal("hide");
            // }, 2000);
          })
        })
        $(".alert-query").modal("hide");
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
  },
  //初始化页码
  getPage: function (count) {
    $("#nextpage").removeClass("disabled");
    $("#prevpage").removeClass("disabled");
    $("#start").removeClass("disabled");
    $("#end").removeClass("disabled");
    $("#currentPage").val(1);
    $(".satelliteid .DESC").css("visibility", "hidden"); //设置排序方式
    $(".result-table .image_date .DESC").css("visibility", "hidden"); //设置排序方式
    let totalPage = Math.ceil(count / 20);
    $("#prevpage").addClass("disabled")
    $("#start").addClass("disabled");
    if (count <= 20 && count !== 0) { //当总数没有一页要求数量
      $("#nextpage").addClass("disabled");
      $("#end").addClass("disabled");
    }
    // $(".page span").html(count);
    $("#total").html(count);
    $("#totalPage").html(totalPage);

  },
  // 全选操作
  allSelect: function () {
    currentSelect.uuid = [];
    currentSelect.filepath = [];
    currentSelect.url = [];
    var param = query.getSearchItem();
    $.ajax({
      type: "GET",
      url: "http://" + config.ip + config.port + config.query + param,
      // data: JSON.stringify(param),
      success: function (data) {
        var response = data.features;
        response.forEach(item => {
          currentSelect.uuid.push(item.properties.uuid)
          //currentSelect.filepath.push(item.properties.filepath)
          if(table === 'sentryimage'){
            currentSelect.url.push(item.properties.tifpath)
            currentSelect.filepath.push(item.properties.tifpath_path)
          }else{
            currentSelect.filepath.push(item.properties.filepath)
          }
        })
        //console.log(currentSelect)
      },
      error: function (data) {
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询失败！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
      }
    });
  },
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
}

var previewMap = function (str, enhance, isdb) {
  preview.getLayers().clear()
  //$("#preview-mouse-position").children().remove();
  var img_open_data = {
    "RequestType": "OpenImage",
    "filepath": str,
    "enhanceImage": enhance, //"none","stdev"
    "isdb": isdb
  };
  var img_open = JSON.stringify(img_open_data);
  //console.log(img_open, `http://${config.ip + config.previewServer + config.preview}`);
  //请求预览
  $.ajax({
    type: 'POST',
    url: `http://${config.ip + config.previewServer + config.preview}`,
    crossDomain: true,
    dataType: 'json',
    contentType: 'application/json',
    data: img_open,
    async: false,
    success: function (data) {
      if (data.status === 'ok') {
        $(".previewMap").show();
        preview.updateSize();
        preview.setView(new ol.View({
          center: [(data.metainfo.geo_rect.min_x + data.metainfo.geo_rect.max_x) / 2, (data.metainfo.geo_rect.min_y + data.metainfo.geo_rect.max_y) / 2],
          zoom: parseInt((data.metainfo.min_Level + 1 + data.metainfo.max_Level) / 2),
          minZoom: data.metainfo.min_Level + 1,
          maxZoom: data.metainfo.max_Level
        }))
        var mapURL = `http://${config.ip + config.previewServer + config.wmtsmap}?sid=${data.sid}&service=wmts&request=getTile&tileMatrix={z}&TileRow={x}&TileCol={y}&format=image/jpg`
        var maptile = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: mapURL,
            tileSize: 256
          }),
          visible: true,
          name: 'map1'
        });
        preview.addLayer(maptile);
        // console.log(preview.getLayers().getArray())
      } else {
        console.log("出错:" + data);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      $(".alert-danger").modal("show");
      $(".alert-danger span").html("影像打开失败！");
      setTimeout(function () {
        $(".alert-danger").modal("hide");
      }, 2000);
    }
  })
}

function drawBox() {
  previewDrawLayer.getSource().clear();
  var maxPoints = 2;
  geometryFunction = function (coordinates, geometry) {
    if (!geometry) {
      //多边形
      geometry = new ol.geom.Polygon(null);
    }
    var start = coordinates[0];
    var end = coordinates[1];
    geometry.setCoordinates([
      [start, [start[0], end[1]], end, [end[0], start[1]], start]
    ]);
    return geometry;
  };
  //实例化交互绘制类对象并添加到地图容器中
  var draw = new ol.interaction.Draw({
    type: 'LineString',
    geometryFunction: geometryFunction,
    //最大点数
    maxPoints: maxPoints
  });

  draw.on("drawend", function (evt) {
    //console.log(evt.feature.getGeometry().getExtent())
    var boxExtent = evt.feature.getGeometry().getExtent();
    var minPoint = ol.proj.toLonLat([boxExtent[0], boxExtent[3]]);
    var maxPoint = ol.proj.toLonLat([boxExtent[2], boxExtent[1]])
    //console.log(minPoint,maxPoint);
    var feature = new ol.Feature(
      new ol.geom.Polygon([
        [
          [boxExtent[0], boxExtent[1]],
          [boxExtent[2], boxExtent[1]],
          [boxExtent[2], boxExtent[3]],
          [boxExtent[0], boxExtent[3]],
          [boxExtent[0], boxExtent[1]]
        ]
      ])
    );
    previewDrawLayer.getSource().addFeature(feature);
    var p0x = minPoint[0];
    var p0y = minPoint[1];
    var p2x = maxPoint[0];
    var p2y = maxPoint[1];
    var parameter = "imagepath=" + diskpath + "&P0X=" + p0x + "&P0Y=" + p0y + "&P2X=" + p2x + "&P2Y=" + p2y;
    $("#clipDown").attr("param", "imagepath=" + diskpath + "&P0X=" + p0x + "&P0Y=" + p0y + "&P2X=" + p2x + "&P2Y=" + p2y);
    //console.log(diskpath);
    $.ajax({
      url: "http://" + config.ip + config.downloadServer + config.imageClipPrepare + "?" + parameter,
      type: "GET",
      success: function (data) {
        console.log(data);
        if (data.status == "ok") {
          var id = data.res.uuid;
          downclip(id);
          //$("#clipInfo").modal("hide");
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("切片服务出错！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
      }
    });
    preview.removeInteraction(draw)
  })
  preview.addInteraction(draw);
  preview.addLayer(previewDrawLayer);
};


function downclip(id) {
  interval = setInterval(function () {
    $.ajax({
      url: "http://" + config.ip + config.downloadServer + config.getImageUrl + "?uuid=" + id,
      type: "GET",
      success: function (data) {
        //console.log(data.res);
        if (data.res.task_status == "success") {
          clearInterval(interval);
          var url = data.res.urls;
          window.open(url);
          $(".alert-query").modal("hide");
        } else if (data.res.task_status == "failed") { //状态失败
          $(".alert-danger").modal("show");
          $(".alert-danger span").html("下载失败！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
          clearInterval(interval);
          $(".alert-query").modal("hide");
        } else if (data.res.task_status == "running") {
          query.queryWait("等待中...");
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("切片服务出错！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
        clearInterval(interval);
        $(".alert-query").modal("hide");
      }
    })
  }, 1000)

}
// 选择行/页
var select = function (flag, uuid, filepath, url) {
  if (flag) {
    if (currentSelect.uuid.indexOf(uuid) == -1) {
      currentSelect.uuid.push(uuid);
      currentSelect.filepath.push(filepath);
      if(table === 'sentryimage'){
        currentSelect.url.push(url);
      }
    }
  } else {
    for (let i = 0; i < currentSelect.uuid.length; i++) {
      if (currentSelect.uuid[i] == uuid) {
        currentSelect.uuid.splice(i, 1);
        currentSelect.filepath.splice(i, 1);
        if(table === 'sentryimage'){
          currentSelect.url.splice(i, 1);
        }
        break;
      }
    }
  }
  $("#current-select").text(currentSelect.uuid.length)
}
// 影像图层
var isAddImage = function (flag, uuid) {
  if (flag) {
    let extent = null;
    let url = null;
    pageLayer.getSource().getFeatures().forEach(function (feature) {
      if (feature.getProperties().uuid == uuid) {
        extent = feature.getGeometry().getExtent();
        url = feature.getProperties().quickview
      }
    })
    let image = new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url: url,
        imageExtent: extent,
        name: uuid,
      }),
      zIndex: 4,
      name: uuid
    });
    map.addLayer(image);
    imagelayer.uuid.push(uuid);
  } else {
    map.getLayers().forEach(function (layer) {
      if (layer.getProperties().name == uuid) {
        map.removeLayer(layer);
      }
    })
  }
}

function download(id) {
  var opts1 = {
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
  $("#downTableContent").mCustomScrollbar('destroy');
  scroll("#downTableContent", "dark-thin")
  $.get("http://" + config.ip + config.downloadServer + config.prepare + "?uuid=" + id, function (data) {
    if (data.status == "ok") {
      var spinner1 = new Spinner(opts1)
      var interval = setInterval(function () {
        $.get("http://" + config.ip + config.downloadServer + config.download + "?uuid=" + id, function (data) {
          ////console.log(data)
          if (data.res['task_status'] == 'failed') {
            $(".downTableContent").find('div').each(function () {
              console.log($(this).find(".downName").attr("uuid"))
              if ($(this).find(".downName").attr("uuid") == id) {
                $(this).find('.downStatus').html('打包失败');

              }
            })
            clearInterval(interval);
          } else if (data.res['task_status'] == 'success') {
            clearInterval(interval);
            var url = data.res["urls"];
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.style.height = 0;
            iframe.src = url[0];
            document.body.appendChild(iframe);
            setTimeout(function () {
              iframe.remove();
            }, 5 * 60 * 1000)
            $(".downTableContent").find('div').each(function () {
              if ($(this).find(".downName").attr("uuid") == id) {
                $(this).find('.downStatus').html("")
                $(this).find('.downStatus').html('<a  download="" href=' + url[0] + '>下载</a>');
              }
            })

          } else {
            $(".downTableContent").find('div').each(function () {
              if ($(this).find(".downName").attr("uuid") == id) {
                var target = $(this).find('.downStatus').get(0);
                spinner1.spin(target)
                $(".failed").hide();
                $(".success").hide();
                // $("#down").show();
                $("#myApplication").modal("hide");
              }
            })

          }
        }).fail(function () {
          $(".alert-danger").modal("show");
          $(".alert-danger span").html("下载服务出错！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
        })
      }, 1000)
    }
    if (data.status == "failed") {
      $(".downTableContent").find('div').each(function () {
        console.log($(this).find(".downName").attr("uuid"))
        if ($(this).find(".downName").attr("uuid") == id) {
          // spinner.spin();
          $(this).find('.downStatus').html(data['why']);

        }
      })
    }
  }).fail(function () {
    $(".alert-danger").modal("show");
    $(".alert-danger span").html("下载服务出错！");
    setTimeout(function () {
      $(".alert-danger").modal("hide");
    }, 2000);
  })
}

function downloadOrigin(path) {
  $.get("http://" + config.ip + config.downloadServer + config.downloadOrigin + "?file=" + path, function (data) {
    console.log(data);
    if (data.status == "ok") {
      if (data.res.task_status == "success") {
        var url = data.res.url;
        window.open(url);
      } else {
        $("#myModal").modal("show");
        $("#searchInfo").html("下载原始信息出错");
        $(".modal-title").html("原始信息下载");
        setTimeout(function () {
          $("#myModal").modal('hide')
        }, 2000);
      }
    } else {
      $("#myModal").modal("show");
      $("#searchInfo").html("下载原始信息出错");
      $(".modal-title").html("原始信息下载");
      setTimeout(function () {
        $("#myModal").modal('hide')
      }, 2000);
    }
  }).fail(function () {
    $(".alert-danger").modal("show");
    $(".alert-danger span").html("下载服务出错！");
    setTimeout(function () {
      $(".alert-danger").modal("hide");
    }, 2000);
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
        //console.log(data);
        if (status == "failed") {
          $(".alert-danger").modal("show");
          $(".alert-danger span").html("查询地名错误！");
          setTimeout(function () {
            $(".alert-danger").modal("hide");
          }, 2000);
          return false;
        }
        var list = ''
        data.features.forEach((item, index) => {
          list += `<li coordinates=${item.geometry.coordinates}>${item.properties.place_name}</li>`
        })
        $(".search-place-list").append(list);
        // var format = new ol.format.GeoJSON();
        // placeLayer.getSource().addFeatures(format.readFeatures(data));
      },
      error: function () {
        $(".alert-danger").modal("show");
        $(".alert-danger span").html("查询地名错误！");
        setTimeout(function () {
          $(".alert-danger").modal("hide");
        }, 2000);
      }
    });
  }
}


/*------------------------------------------------列表---------------------------------------------------*/
var minimap;
var minimap_vectorLayer;
var list = {
  init: function () {
    scroll(".list-search-table tbody", "dark-thick");
    $(".selectpicker").selectpicker({
      noneSelectedText: '请选择卫星名称'
    });
    $('.selectpicker').selectpicker('refresh');
    $('.selectpicker').selectpicker('render');
    $("#list-resolution").bootstrapSlider();
    $("#list-resolution").on("slide", function (slideEvt) {
      $("#list-resolutionSliderVal").text(slideEvt.value);
    });
    $("#list-creationTimeFrom").val("");
    $("#list-creationTimeTo").val("");
    $("#list-details-map").children().remove();
    list.query.getCount();
    list.setMap();
    if(table === 'sentryimage'){
      $(".list-search-table thead .sentryimage").show().siblings().hide();
      $("#list-search-item .coop-uncoop").hide();
    }else{
      $(".list-search-table thead .sentryimage").hide().siblings().show();
      $("#list-search-item .coop-uncoop").show();
    }
  },
  setMap: function () {
    var baseLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
      }),
    });
    minimap_vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(241, 145, 145, 0)"
        }),
        stroke: new ol.style.Stroke({ //边界样式
          color: 'red',
          width: 2
        }),
      }),
      zIndex: 2
    });
    minimap = new ol.Map({
      layers: [baseLayer, minimap_vectorLayer],
      view: new ol.View({
        center: [104.5602, 32.407], //ol.proj.transform([104.5602,32.4070],'EPSG:4326','EPSG:3857')
        projection: "EPSG:4326",
        zoom: 4,
        minZoom: 0,
        maxZoom: 23,
        extent: [-180, -90, 180, 90],
      }),
      target: "list-details-map",
      interactions: ol.interaction.defaults({
        doubleClickZoom: false,
      }),
      controls: ol.control.defaults({
        zoom: false,
        attribution: false,
      }),
    });
  },
  query: {
    clear: function () {
      $("#list-search-input").val("");
      $("#list-search-item input[type=text]").val('');
      $("#list-search-item .selectpicker").selectpicker('val', '');
      $("#list-resolution").bootstrapSlider("setValue", 0);
      $("#list-resolutionSliderVal").text(0);
    },
    getCoord: function (selector) {
      let val = $(selector).val();
      if (val.indexOf(" ") === -1) {
        return parseFloat(val);
      } else {
        let temp = val.split(" ");
        let D = parseInt(temp[0]);
        let H = temp[1] ? Math.abs(temp[1]) / 60 : 0;
        let S = temp[2] ? Math.abs(temp[2]) / 3600 : 0;
        return parseFloat((D + H + S).toFixed(3));
      }
    },
    getSearchItem: function () {
      let param = {
        "table": table,
        'resultType': "details"
      }
      //经纬度
      let lnglatType = $(".input-lnglat-menu .clicked").attr("id");
      let count = 0;
      if (lnglatType === "list-rect-select") {
        $(".list-rect input[type=text]").each(function () {
          if ($(this).val().replace(/(\s*)/g, "") != "") {
            count++;
          }
        })
        if (count > 0 && count < 4) {
          $(".alert-info").show();
          $(".alert-info span").html("请输入完整的经纬度！");
          setTimeout(function () {
            $(".alert-info").hide();
          }, 2000);
          return false;
        } else if (count === 4) {
          let topleftlng = this.getCoord("#list-topleftlng");
          let bottomrightlng = this.getCoord("#list-bottomrightlng");
          if (Math.abs(topleftlng) > 180 || Math.abs(bottomrightlng) > 180 || topleftlng > bottomrightlng) {
            $(".alert-info").show();
            $(".alert-info span").html("请输入正确的经度！");
            setTimeout(function () {
              $(".alert-info").hide();
            }, 2000);
            return false;
          }
          let topleftlat = this.getCoord("#list-topleftlat");
          let bottomrightlat = this.getCoord("#list-bottomrightlat");
          if (Math.abs(topleftlat) > 90 || Math.abs(bottomrightlat) > 90 || topleftlat < bottomrightlat) {
            $(".alert-info").show();
            $(".alert-info span").html("请输入正确的纬度！");
            setTimeout(function () {
              $(".alert-info").hide();
            }, 2000);
            return false;
          }
          let polygon = `POLYGON((${topleftlng} ${topleftlat},${bottomrightlng} ${topleftlat},${bottomrightlng} ${bottomrightlat},${topleftlng} ${bottomrightlat},${topleftlng} ${topleftlat}))`;
         // param['polygon'] = polygon;
          table === "sentryimage" ? param['wkt'] = polygon :  param['polygon'] = polygon;
        }
      } else {
        $(".list-circle input[type=text]").each(function () {
          if ($(this).val().replace(/(\s*)/g, "") != "") {
            count++;
          }
        })
        if (count > 0 && count < 3) {
          $(".alert-info").show();
          $(".alert-info span").html("请输入完整的经纬度！");
          setTimeout(function () {
            $(".alert-info").hide();
          }, 2000);
          return false;
        } else if (count === 3) {
          let lng = this.getCoord("#circle-lng");
          let lat = this.getCoord("#circle-lat");
          if (Math.abs(lng) > 180 || Math.abs(lat) > 90) {
            $(".alert-info").show();
            $(".alert-info span").html("请输入正确的经纬度！");
            setTimeout(function () {
              $(".alert-info").hide();
            }, 2000);
            return false;
          }
          let radius = parseFloat($("#circle-radius").val().replace(/(\s*)/g, "")) / minimap.getView().getProjection().getMetersPerUnit();
          let latLength = Math.abs(0.707 * radius);
          let lngLength = Math.abs(0.707 * radius);
          let topLeft = [parseFloat(lng - lngLength), parseFloat(lat) + latLength];
          let bottomLeft = [parseFloat(lng - lngLength), parseFloat(lat - latLength)];
          let topRight = [parseFloat(lng) + lngLength, parseFloat(lat) + latLength];
          let bottomRight = [parseFloat(lng) + lngLength, parseFloat(lat - latLength)];
          let polygon = `POLYGON((${topLeft[0]} ${topLeft[1]},${topRight[0]} ${topRight[1]},${bottomRight[0]} ${bottomRight[1]}, ${bottomLeft[0]} ${bottomLeft[1]},${topLeft[0]} ${topLeft[1]}))`;
         // param['polygon'] = polygon;
         table === "sentryimage" ? param['wkt'] = polygon :  param['polygon'] = polygon;
        }
      }
      //卫星代号
      if ($("#list-satellite option:selected").length) {
        let selected = $("#list-satellite option:selected");
        selected = Array.from(selected)
        selected = selected.map(val => val.value);
        param['satelliteid'] = selected.join("|");
      }
      //分辨率
      if (parseFloat($("#list-resolutionSliderVal").text())) {
        param["resolutionFrom"] = 0;
        param["resolutionTo"] = parseFloat($("#list-resolutionSliderVal").text());
      }
      //成像时间
      if ($("#list-creationTimeFrom").val().replace(/(\s*)/g, "") != "") {
        let timeFrom = $("#list-creationTimeFrom").val().replace(/(\s*)/g, "");
        table === "sentryimage" ?  param['image_dateFrom'] = timeFrom :  param['imagetimeFrom'] = timeFrom;
      }
      if ($("#list-creationTimeTo").val().replace(/(\s*)/g, "") != "") {
        let timeTo =  $("#list-creationTimeTo").val().replace(/(\s*)/g, "");
        table === "sentryimage" ?  param['image_dateTo'] = timeTo : param['imagetimeTo'] = timeTo;
      }

      // 模糊搜索
      let searchinput = $("#list-search-input").val().replace(/(^\s*)|(\s*$)/g, "");
      if (searchinput != "") {
        let temp = searchinput.split(/[\n\s+；;，,]/g);
        temp = temp.filter(val => val !== "")
        temp = temp.join("|");
        table === "sentryimage" ?   param["idLike"] = temp :  param["anytextLike"] = temp;
      }
      return param;
    },
    //初始化页码
    initPage: function (count) {
      $("#list-nextpage").removeClass("disable");
      $("#list-prevpage").removeClass("disable");
      $("#list-currentPage").val(1);
      let totalPage = Math.ceil(count / 10);
      $("#list-prevpage").addClass("disable")
      if (count <= 10 && count !== 0) { //当总数没有一页要求数量
        $("#list-nextpage").addClass("disable");
      }
      $(".list-page span").html(count);
      $("#list-totalPage").html(totalPage);
      $(".list-imagetime .list-DESC").css("visibility", "hidden"); //设置排序方式
      $(".list-image_date .list-DESC").css("visibility", "hidden"); //设置排序方式
    },
    getCount: function () {
      //清空选择
      currentSelect.uuid = [];
      currentSelect.filepath = [];
      currentSelect.url = [];
      let param = this.getSearchItem();
      if (param) {
        param['geoformat'] = 'count';
        let search = [];
        for (let key in param) {
          search.push(key + '=' + param[key]);
        }
        $.ajax({
          type: "GET",
          url: "http://" + config.ip + config.port + config.query + "?" + search.join("&"),
          success: function (data) {
            let count = data.count;
            list.query.initPage(count);
            if (count > 0) {
              list.query.getTable();
            } else {
              $(".list-search-table tbody").mCustomScrollbar("destroy");
              $(".list-search-table tbody").html("");
              // scrollInner(".list-search-table tbody");
              $("#list-prevpage").addClass("disable");
              $("#list-nextpage").addClass("disable");
              $(".list-details-text > div span:last-child").text('');
              $(".list-details-picture img").attr('src', '../images/picture.png');
              minimap_vectorLayer.getSource().clear();
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
      }
    },
    //获取表格数据
    getTable: function () {
      query.queryWait("正在查询...")
      let currentPage = $("#list-currentPage").val();
      let pageFrom = (currentPage - 1) * 10 + 1;
      let pageTo = currentPage * 10;
      pageTo = pageTo > parseInt($(".list-page span").innerText) ? parseInt($(".list-page span").innerText) : pageTo;
      let param = this.getSearchItem();
      param['from'] = pageFrom;
      param['to'] = pageTo;
      $(".list-asc-desc img").each(function () {
        if ($(this).css("visibility") == "hidden" && $(this).parents('tr').css('display') !== 'none') {
          let sort = $(this).siblings().attr("class").split("-")[1];
          let sortItem = $(this).parent().parent().attr("class").split("-")[1];
          param['sortBy'] = sortItem;
          param['orderBy'] = sort;
        }
      });
      let search = [];
      for (let key in param) {
        search.push(key + '=' + param[key]);
      }
      $.ajax({
        type: "GET",
        url: "http://" + config.ip + config.port + config.query + "?" + search.join("&"),
        success: function (data) {
          list.query.tableInner(data.features);
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
    },
    //渲染表格
    tableInner: function (features) {
      $(".list-search-table tbody").mCustomScrollbar("destroy");
      let list = "";
      if(table === "sentryimage"){
        features.forEach(val => {
          let title = val.properties.tifname || '暂无';
          let imageTime = val.properties.image_date ? val.properties.image_date.split(" ")[0] : "暂无";
          let resolution = val.properties.resolution || "暂无";
          let uuid = val.properties.id;
          let imgSrc = currentSelect.uuid.indexOf(uuid) > -1 ? "../images/checknew2.png" : "../images/checknew.png";
          let details = {
            'uuid': uuid || '暂无',
            'filepath': val.properties.tifpath_path || '暂无',
            'tifpath': val.properties.tifpath || '暂无',
            'imagetime': imageTime || '暂无',
            'title': val.properties.tifname || '暂无',
            'resolution': val.properties.resolution || '暂无',
            'quickview': val.properties.thumbnail || 'null',
            'band_num': val.properties.band_num || '暂无',
            'coord': val.geometry ? JSON.stringify(val.geometry.coordinates) : '暂无',
            'isdb': false,
          }
          list += `<tr data-feature=${JSON.stringify(details)}>` +
            `<td><img class="tbody-check" src=${imgSrc} /></td>` +
            `<td>${title}</td>` +
            `<td>${imageTime}</td>` +
            `<td>${resolution}</td>` +
            `</tr>`;
  
        });
      }else{
        features.forEach(val => {
          let title = val.properties.title || '暂无';
          let imageTime = val.properties.imagetime ? val.properties.imagetime.split(" ")[0] : "暂无";
          let satellite = val.properties.describe || "暂无";
          let uuid = val.properties.uuid;
          let imgSrc = currentSelect.uuid.indexOf(uuid) > -1 ? "../images/checknew2.png" : "../images/checknew.png";
          let details = {
            'uuid': uuid || '暂无',
            'filepath': val.properties.filepath.split(";")[0] || '暂无',
            'rootpath': val.properties.rootpath || '暂无',
            'imagetime': imageTime || '暂无',
            'inbasetime': val.properties.inbasetime.split(" ")[0] || '暂无',
            'title': val.properties.title || '暂无',
            'resolution': val.properties.resolution || '暂无',
            'satelliteid': val.properties.satelliteid || '暂无',
            'quickview': val.properties.quickview || 'null',
            'coord': val.geometry ? JSON.stringify(val.geometry.coordinates) : '暂无',
            'isdb': false,
            'zippath': val.properties.zippath || false
          }
          list += `<tr data-feature=${JSON.stringify(details)}>` +
            `<td><img class="tbody-check" src=${imgSrc} /></td>` +
            `<td>${title}</td>` +
            `<td>${imageTime}</td>` +
            `<td>${satellite}</td>` +
            `</tr>`;
  
        });
      }
      $(".list-search-table tbody").html(list);
      scroll(".list-search-table tbody", "dark-thick");
      let count = 0
      $(".list-search-table tbody .tbody-check").each(function () {
        count += $(this).attr('src') == "../images/checknew2.png" ? 1 : 0
      })
      let thImgSrc = count === $(".list-search-table tbody tr").length && count != 0 ? "../images/checknew2.png" : "../images/checknew.png";
      $(".thead-all-select").attr('src', thImgSrc);
      $(".list-search-table tbody tr:first-child").click();
      $(".alert-query").modal("hide");
    }
  }
}
//模式切换
function changeMode(mod) {
  mode = mod;
  if (mode == "list") {
    $(".list-content").show();
    $(".map-content").hide();
    $(this).find("img").attr("src", "../images/liebiao2.png");
    $(this).siblings().find("img").attr("src", "../images/ditu.png");
    list.query.clear();
    list.init();
  } else {
    $(".list-content").hide();
    $(".map-content").show();
    $(this).find("img").attr("src", "../images/ditu2.png");
    $(this).siblings().find("img").attr("src", "../images/liebiao.png");
    $("#reset-search").click();
    $("#search-item").click();
    $("#current-select").text('--');
    $(".selectAll").attr('src', '../images/checknew.png');
    $(".result-table .table-head .check img").attr('src', '../images/checknew.png');
    $(".result-table .table-body").html('');
    $("#currentPage").val('');
    $("#totalPage").text('');
    $("#total").text('--');
    $("#current-select").text('--');
    $("#reset").click();
    //map.updateSize();
    if(table === 'sentryimage'){
      $(".search-ps").hide();
      $(".result-table thead .sentryimage").show().siblings().hide();
    }else{
      $(".search-ps").show();
      $(".result-table thead .sentryimage").hide().siblings().show();
    }
  }
}
//数据类型
function changeType(tab, mode) {
  table = tab;
  //console.log(tab);
  mode = mode;
  if (mode == "list") {
    list.init();
    $(".list-content").show();
    $(".map-content").hide();
  } else {
    $("#reset-search").click()
    // 清空地图查询结果
    $(".table-body").html("<div class=\"table-nodata\">暂无数据</div>");
    $("#total").text("--");
    $("#search-item").find(".nav-link").addClass("active");
    $("#search-result").find(".nav-link").removeClass("active");
    $(".search-item").show().siblings().hide();
    clearSelect()
    $(".list-content").hide();
    $(".map-content").show();
    //map.updateSize();
    if(table === 'sentryimage'){
      $(".search-ps").hide();
      $(".result-table thead .sentryimage").show().siblings().hide();
    }else{
      $(".search-ps").show();
      $(".result-table thead .sentryimage").hide().siblings().show();
    }
  }
  //sessionStorage.setItem("mode", mode);
  //sessionStorage.setItem("table", table);
}
window.changeMode = changeMode
window.changeType = changeType
//window.changeType('sentryimage', 'list') //cooperative
