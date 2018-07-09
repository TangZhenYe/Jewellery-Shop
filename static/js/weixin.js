/*
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript" charset="utf-8" src="tool/weixin/weixin.js?t=sdfa"></script>
<script>
share_base({$wxconfig[appid]},{$wxconfig[timestamp]},{$wxconfig[noncestr]},{$wxconfig[signature]},'false')
share(title,desc,url,img_url,ajax_url)
</script>
*/
function share_base(appid,timestamp,noncestr,signature,is_debug){
	if(is_debug!="true"){
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: appid, // 必填，公众号的唯一标识
		    timestamp:timestamp, // 必填，生成签名的时间戳
		    nonceStr: noncestr, // 必填，生成签名的随机串
		    signature: signature,// 必填，签名，见附录1
		     jsApiList: ['closeWindow','onMenuShareTimeline','showOptionMenu ','onMenuShareAppMessage','onMenuShareQQ', 'onMenuShareWeibo', 'downloadImage', 'uploadImage', 'chooseImage',"openLocation","getLocation","scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		 });
	}
	if(is_debug=="true"){

		wx.config({
			debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: appid, // 必填，公众号的唯一标识
		    timestamp:timestamp, // 必填，生成签名的时间戳
		    nonceStr: noncestr, // 必填，生成签名的随机串
		    signature: signature,// 必填，签名，见附录1
		     jsApiList: ['closeWindow','onMenuShareTimeline','showOptionMenu ','onMenuShareAppMessage','onMenuShareQQ', 'onMenuShareWeibo', 'downloadImage', 'uploadImage', 'chooseImage',"openLocation","getLocation","scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		 });
		
	}
}
function wx_scanQRCode(){
	wx.scanQRCode({

		needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，

		scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有

		success: function (res) {

			var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

		}

	});
}
//打开地图
function wx_map(location_y,location_x,title,address){

	location_y=parseFloat(location_y);
	location_x=parseFloat(location_x);

	wx.openLocation({
		latitude:location_y, // 纬度，浮点数，范围为90 ~ -90
		longitude:location_x, // 经度，浮点数，范围为180 ~ -180。<?php echo $data['display']['location_y'];?>
		name: ''+title+'', // 位置名
		address: ''+address+'', // 地址详情说明
		scale:14, // 地图缩放级别,整形值,范围从1~28。默认为最大
		infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
	});
}
function wx_getLocation(type){
	if(type==''){
		type="wgs84";	
	}
	wx.getLocation({
		type: type, // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
		success: function (res) {
			var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
			var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
			var speed = res.speed; // 速度，以米/每秒计
			var accuracy = res.accuracy; // 位置精度
			set_Location(longitude,latitude);
		}
	});
}

//share('来自{$data[detail][username]}的转赠',desc,link,img_url,ajax_url);
function share(title,desc,url,img_url,ajax_url){

	
	//分享到朋友圈
	wx.onMenuShareTimeline({
	    title: title, // 分享标题
	    link: url, // 分享链接
	    imgUrl: img_url, // 分享图标
	    success: function () { 
	    	if(ajax_url!=null){
	    		$.ajax({
	    			type: "post",
	    			url: ajax_url,
	    			dataType: "json", 
	    			success:function(data){

	    				if(data.status==10001){
	    					alert('分享成功，获得积分');
	    				}else if(data.status==10002){
	    					alert('已分享');
	    				}

	    			},

	    			error:function(data,textStatus) {
	    				aleert("false")
	    			},
	    			complete: function(data,textStatus) {

	    			}
	    		})
	    	}
	    	
	    },
	    cancel: function () { 

	    }
	});
//分享给朋友	
wx.onMenuShareAppMessage({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
		    link: url, // 分享链接
		    imgUrl: img_url, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		    	$.ajax({
		    		type: "post",
		    		url: ajax_url,
		    		dataType: "json", 
		    		success:function(data){

		    			if(data.status==10001){
		    				alert('分享成功，获得积分'+data.point);
		    			}else if(data.status==10002){
		    				alert('已分享');
		    			}
		    		},			    		
		    		error:function(data,textStatus) {
		    			aleert("false")
		    		},
		    		complete: function(data,textStatus) {

		    		}	
		    	})
		    },
		    cancel: function () { 

		    }
		});

	//分享到QQ
	wx.onMenuShareQQ({
	    title: title, // 分享标题
	    desc: title, // 分享描述
	    link: url, // 分享链接
	    imgUrl: img_url, // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	   },
	   cancel: function () { 
	       // 用户取消分享后执行的回调函数
	   }
	});
//分享到腾讯微博	
wx.onMenuShareWeibo({
	    title: title, // 分享标题
	    desc: title, // 分享描述
	    link: url, // 分享链接
	    imgUrl: img_url, // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	   },
	   cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});

}