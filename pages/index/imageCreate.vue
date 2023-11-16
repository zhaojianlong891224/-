<template>
	<view class="wrap">
		<view class="desc">{{params.desc}}</view>
		<view class="createimg">
			<view class="loading" v-if="loading"></view>
			<image v-else src="https://pic.52112.com/2019/06/06/JPS-190606_155/24poJOgl7m_small.jpg"></image>
		</view>
		<view class="createimg">
			<image :src="params.tempFilePath"></image>
		</view>
		<view class="btnGroup">
			<button type="default" class="btnGroup-share" @tap="shareEvent">
				<image src="../../static/icon/share.png"></image>
				<text>分享赚次数</text>
			</button>
			<button type="default" class="btnGroup-zan actived" @tap="thumbsupEvent">
				👍
				<text>{{thumbsNumber}}</text>
			</button>
			<button type="default" class="btnGroup-zan">
				👎
				<text>{{diffNumber}}</text>
			</button>
		</view>
		<view class="modal" v-show="show">
			<button type="default" @tap="show=false">关闭</button>
			<canvas canvas-id="canvas" class="canvas" @longpress="longpressEvent"></canvas>
		</view>
		
	</view>
</template>

<script>
	import { getElementInfo } from '../../utils/utils.js'
	export default{
		data() {
			return {
				loading: true,
				thumbsNumber:0,
				diffNumber:0,
				show: false,
				params:{},
				localImgPath:"",
				localQrcodePath:"",
				ctx:null,
				item:["保存图片"],
				canvasAttr:{}
			}
		},
		onLoad(e) {
			this.params = e;
			setTimeout(() => {
				this.loading = false;
			},2000)
		},
		onReady() {
			uni.getImageInfo({
				src:'https://pic.52112.com/2019/06/06/JPS-190606_155/24poJOgl7m_small.jpg',
				success:(res) => {
					this.localImgPath = res.path;
				}
			})
			uni.getImageInfo({
				src:'https://img.zcool.cn/community/01f0fd580987aba84a0d304fe70b7b.jpg@1280w_1l_2o_100sh.jpg',
				success:(res) => {
					this.localQrcodePath = res.path
				}
			
			})
		},
		methods:{
			thumbsupEvent() {
				this.thumbsNumber +=1;
			},
			shareEvent() {
				this.show = true;
				this.$nextTick(async () => {
					const data = await getElementInfo('.canvas');
					this.canvasAttr = data[0];
					const {width, height} = data[0]
					const canvasWH = (width - 20) / 2;
					this.ctx = uni.createCanvasContext('canvas', this);
					this.ctx.drawImage(this.params.tempFilePath,10,70,canvasWH,canvasWH);
					this.ctx.drawImage(this.localImgPath,canvasWH + 10,70,canvasWH,canvasWH);
					this.ctx.setStrokeStyle('#979797');
					this.ctx.strokeRect(10,70,370,185);
					this.ctx.setTextAlign('center');
					this.ctx.setFontSize(16)
					this.ctx.fillText(this.params.desc,185, 285);
					this.ctx.rect(0, 305,width,114)
					this.ctx.setFillStyle("#F1F1F1");
					this.ctx.fill();
					this.ctx.drawImage(this.localQrcodePath,30,325,77,77)
					this.ctx.setFontSize(16)
					this.ctx.setFillStyle('#333');
					this.ctx.fillText('我是大画家',165, 360);
					this.ctx.setFontSize(14)
					this.ctx.setFillStyle('#939393');
					this.ctx.fillText('长按可以保存图片',180, 380);
					this.ctx.draw();
				})
				
			},
			longpressEvent() {
				uni.showActionSheet({
					itemList:this.item,
					success:(res) => {
						const {width, height} = this.canvasAttr;
						uni.canvasToTempFilePath({
							canvasId:"canvas",
							x:0,
							y:0,
							width,
							height,
							success:(res) => {
								uni.saveImageToPhotosAlbum({
									filePath:res.tempFilePath,
									success:() => {
										uni.showToast({
											title:'保存成功'
										})
									}
								})
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	page{
		background-color: #F9F9F9;
	}
	.desc{
		font-size: 32rpx;
		color: #333;
		padding: 40rpx 20rpx;
	}
	.createimg{
		width: 730rpx;
		height: 730rpx;
		border: 1px solid #eee;
		margin: 0 auto;
		position: relative;
		image{
			width: 100%;
			height: 100%;
			
		}
	}
	.btnGroup{
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		&-share{
			font-size: 28rpx;
			color: #333;
			width: 260rpx;
			height: 74rpx;
			border-radius: 38rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0;
			image{
				width:38rpx;
				height: 38rpx;
				margin-right: 10rpx;
			}
		}
		&-zan{
			min-width: 106rpx;
			height: 74rpx;
			border-radius: 74rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0;
			text{
				margin-left: 10rpx;
				color: #22A3FF;
				font-size: 28rpx;
			}
		}
		.actived{
			background-color: #EBF8FF;
			border: 1px solid #22A3FF;
		}
		button{
			box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0,0,0,0.1);
			margin-right: 30rpx;
		}
	}
	.loading {
	  width: 100rpx;
	  height: 100rpx;
	  border: 4rpx solid #000;
	  border-top-color: transparent;
	  border-radius: 100%;
	  animation: circle infinite 0.75s linear;
		position: absolute;
		top: 50%;
		left: 50%;
		margin: -50rpx 0 0 -50rpx;
	}
	.modal{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;
		background-color: rgba(#000000, 0.4);
		.canvas{
			width: 710rpx;
			height: 760rpx;
			background-color: #fff;
			position: absolute;
			top: 50%;
			left: 50%;
			margin: -380rpx 0 0 -355rpx
		}
	}
	// 转转转动画
	@keyframes circle {
	  0% {
	    transform: rotate(0);
	  }
	  100% {
	    transform: rotate(360deg);
	  }
	}
</style>