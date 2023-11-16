<template>
	<view class="content">
		<view class="opreate">
			<view>在下面的画布中随意创作吧</view>
			<view class="btnGroup">
				<button type="default" style="margin-right: 20rpx;" @tap="clearEvent">
					<image src="../../static/icon/del.png"></image>
				</button>
				<button type="default">
					<image src="../../static/icon/reset.png"></image>
				</button>
			</view>
		</view>
		<canvas canvas-id="canvas" class="canvas" 
		@touchstart="touchstartEvent" @touchmove="touchmoveEvent" @touchend="touchendEvent"></canvas>
		<div class="search">
			<input placeholder="描述一下你想要创作的图片" :value="desc" type="text"/>
			<view class="tag">5</view>
			<button type="default" @click="toPage">生成</button>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pain: false,
				lastPoint:{
					x:0,
					y:0
				},
				desc:"我是一只小猫咪",
				ctx:null,
				canvasWH:{}
			}
		},
		onLoad() {

		},
		onReady() {
			this.ctx = uni.createCanvasContext('canvas', this);
			// 获取canvas画布的宽高
			uni.createSelectorQuery().select('.canvas').boundingClientRect().exec(res => {
				const { width, height } = res[0]
				this.canvasWH = {width, height}
			})
			console.log(document.getElementsByClassName('.canvas'))
		},
		methods: {
			touchstartEvent(e) {
				this.pain = true;
				const {x , y} = e.touches[0];
				this.lastPoint = {x, y}
			},
			touchmoveEvent(e) {
				if(this.pain) {
					const {x, y} = e.touches[0];
					const newPoint = {x, y};
					this.drawLine(this.lastPoint.x, this.lastPoint.y, newPoint.x, newPoint.y);
					this.lastPoint = newPoint;
				}
			},
			touchendEvent() {
				this.pain = false;
			},
			drawLine(x1, y1, x2, y2) {
				this.ctx.beginPath()
				this.ctx.setLineWidth(10);
				this.ctx.setLineCap('round')
				this.ctx.setLineJoin('round')
				this.ctx.moveTo(x1, y1)
				this.ctx.lineTo(x2, y2);
				this.ctx.setStrokeStyle('red')
				this.ctx.closePath();
				this.ctx.stroke();
				this.ctx.draw(true);
				
			},
			clearEvent() {
				uni.showModal({
					title:'提示',
					content:'确定要清空画布当中的内容吗？',
					confirmText:'确定',
					success:(res) => {
						if(res.confirm) {
							this.ctx.draw();
						}
					},
				})
			},
			toPage() {
				const {width, height} = this.canvasWH;
				uni.canvasToTempFilePath({
					canvasId:"canvas",
					x:0,
					y:0,
					width,
					height,
					success:({tempFilePath}) => {
						if(tempFilePath) {
							uni.navigateTo({
								url:`/pages/index/imageCreate?tempFilePath=${tempFilePath}&desc=${this.desc}`
							})
						}
					}
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{
		overflow: hidden;
	}
	.opreate{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 20px;
		font-size: 32rpx;
		color: #939393;
		.btnGroup{
			display: flex;
			align-items: center;
			button{
				width: 106rpx;
				height: 68rpx;
				background-color: #22A3FF;
				border-radius: 34rpx;
				display: flex;
				align-items: center;
				image{
					width: 42rpx;
					height: 42rpx;
				}
			}
		}
		
	}
	.canvas{
		background-color: #fff;
		border: 1px solid #22A3FF;
		width: 730rpx;
		height: 730rpx;
		margin: 0 auto;
	}
	.search{
		width:710rpx;
		height: 96rpx;
		margin: 0 auto;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		margin-top: 65rpx;
		position: relative;
		input{
			width: 570rpx;
			height: 92rpx;
			border: 1px solid #eee;
			border-right: 0;
			padding-left: 38rpx;
			border-radius: 48rpx 0 0 48rpx;
			&::placeholder{
				color: #A7A7A7;
			}
		}
		button{
			width: 140rpx;
			height: 100%;
			background-color: #22A3FF;
			color: #fff;
			border-radius: 0 48rpx 48rpx 0;
			display: flex;
			align-items: center;
			font-size: 32rpx;
		}
		.tag{
			width: 60rpx;
			height: 35rpx;
			line-height: 35rpx;
			background-color: #FF8122;
			color: #fff;
			border-radius: 35rpx;
			font-size: 28rpx;
			text-align: center;
			position: absolute;
			top: -46rpx;
			right: 50rpx;
		}
	}
</style>
