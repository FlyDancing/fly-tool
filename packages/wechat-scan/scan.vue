<template>
  <div class="page-scan">
    <!--返回-->
    <!-- <van-nav-bar title="扫描二维码/条形码" fixed @click-left="clickIndexLeft()" class="scan-index-bar">
            <template #left>
                <van-icon name="arrow-left" size="18" color="#fff" />
                <span style="color: #fff"> 取消 </span>
            </template>
        </van-nav-bar> -->
    <!-- <van-nav-bar
        title="扫描二维码/条形码"
        right-text="按钮"
        left-arrow
         fixed
        @click-right="onClickRight"
         @click-left="clickIndexLeft()"
        /> -->
    <!-- 扫码区域 -->
    <div v-show="loadingShow" class="QrCode">
      <div class="back-arrow" @click="clickIndexLeft">
        <!-- <van-icon name="arrow-left" color="#fff" /> -->
      </div>
      <video ref="video" height="100%" width="100%" id="video" autoplay></video>
      <div class="qr-scanner">
        <div class="box">
          <div class="line"></div>
          <div class="angle"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 提示语 -->
  <div v-show="tipShow" class="scan-tip">{{ tipMsg }}</div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref } from 'vue'
  import { BrowserMultiFormatReader, Result } from '@zxing/library'

  const emits = defineEmits(['decode'])
  const data = reactive({
    loadingShow: false,
    scanText: '',
    tipMsg: '正在尝试识别....',
    tipShow: false
  })
  const { loadingShow, scanText, tipMsg, tipShow } = toRefs(data)
  const codeReader = ref<BrowserMultiFormatReader>(
    new BrowserMultiFormatReader()
  )

  function openScan() {
    codeReader.value
      ?.listVideoInputDevices()
      .then((videoInputDevices) => {
        tipShow.value = true
        tipMsg.value = '正在调用摄像头...'
        console.log('videoInputDevices', videoInputDevices)
        // 默认获取第一个摄像头设备id
        let firstDeviceId = videoInputDevices[0].deviceId
        // 获取第一个摄像头设备的名称
        const videoInputDeviceslablestr = JSON.stringify(
          videoInputDevices[0].label
        )
        if (videoInputDevices.length > 1) {
          // 判断是否后置摄像头
          if (videoInputDeviceslablestr.indexOf('back') > -1) {
            firstDeviceId = videoInputDevices[0].deviceId
          } else {
            firstDeviceId = videoInputDevices[1].deviceId
          }
        }
        decodeFromInputVideoFunc(firstDeviceId)
      })
      .catch((err) => {
        tipShow.value = false
        console.error(err)
      })
  }

  function decodeFromInputVideoFunc(firstDeviceId: string) {
    codeReader.value?.reset() // 重置
    scanText.value = ''
    codeReader.value?.decodeFromVideoDevice(
      firstDeviceId,
      'video',
      (result: Result, err: any) => {
        loadingShow.value = true
        tipMsg.value = '正在尝试识别...'
        scanText.value = ''
        if (result) {
          console.log('扫描结果', result)
          scanText.value = result.getText()

          if (scanText.value) {
            tipShow.value = false
            clickIndexLeft()
            loadingShow.value=false
            emits('decode', result)
          }
        }
        if (err && !err) {
          tipMsg.value = '识别失败'
          setTimeout(() => {
            tipShow.value = false
          }, 2000)
          console.error(err)
        }
      }
    )
  }
  function clickIndexLeft() {
    console.log('我要传参了', scanText.value)
    codeReader.value?.reset() // 重置
  }

  const closeScan = () => {
    loadingShow.value = false
    codeReader.value?.reset() // 重置
  }

  defineExpose({
    openScan,
    closeScan
  })
</script>

<style scoped lang="scss">
  .page-scan {
    width: 100%;
    height: 100%;
  }
  .QrCode {
    width: 100%;
    height: 100%;
    position: relative;
    #video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .qr-scanner {
    background-size: 3rem 3rem;
    background-position: -1rem -1rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .qr-scanner .box {
    width: 75vw;
    height: 75vw;
    max-height: 75vh;
    max-width: 75vh;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    // border: 0.1rem solid rgba(0, 255, 51, 0.2);
  }
  .qr-scanner .line {
    height: 50px;
    width: 90%;
    background: radial-gradient(
      3358px circle at 50% 661%,
      #00ff33,
      transparent 10%
    );
    border-bottom: 1px solid #00ff33;
    transform: translateY(-100%);
    animation: radar-beam 2.3s infinite ease-in;
    animation-timing-function: ease-in;
    animation-delay: 0.5s;
    margin: 0 auto;
  }
  //   .qr-scanner .box:after,
  //   .qr-scanner .box:before,
  //   .qr-scanner .angle:after,
  //   .qr-scanner .angle:before {
  //     content: '';
  //     display: block;
  //     position: absolute;
  //     width: 3vw;
  //     height: 3vw;
  //     border: 0.2rem solid transparent;
  //   }
  .qr-scanner .box:after,
  .qr-scanner .box:before {
    top: 0;
    border-top-color: #00ff33;
  }
  .qr-scanner .angle:after,
  .qr-scanner .angle:before {
    bottom: 0;
    border-bottom-color: #00ff33;
  }
  .qr-scanner .box:before,
  .qr-scanner .angle:before {
    left: 0;
    border-left-color: #00ff33;
  }
  .qr-scanner .box:after,
  .qr-scanner .angle:after {
    right: 0;
    border-right-color: #00ff33;
  }
  @keyframes radar-beam {
    0% {
      transform: translateY(-100%);
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translateY(100vh);
    }
  }

  .qr-scanner .back-arrow {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
