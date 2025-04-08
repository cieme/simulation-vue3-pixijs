<template>
  <div class="login-container flex justify-center items-center overflow-hidden">
    <LoginBg class="absolute top-0 left-0 w-full h-full -z-0" />
    <div class="login-wrapper p-10 rounded-lg relative">
      <a-config-provider
        :csp="{ nonce: 'YourNonceCode' }"
        component-size="middle"
        :theme="{
          algorithm: theme.defaultAlgorithm,
        }"
      >
        <a-typography-title class="text-center !mb-3" :level="1"> 欢迎回来 </a-typography-title>
        <a-typography-title class="text-center !mt-0" :level="4"> 离散仿真工具 </a-typography-title>

        <a-form
          class="mt-6"
          :model="formState"
          name="basic"
          layout="vertical"
          :label-col="{ span: 0 }"
          :wrapper-col="{ span: 24 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item
            label="用户名"
            name="username"
            :rules="[{ required: true, message: '请输入用户名!' }]"
          >
            <a-input placeholder="用户名" v-model:value="formState.username" />
          </a-form-item>

          <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '请输入密码!' }]"
          >
            <a-input-password
              autocomplete="off"
              placeholder="密码"
              v-model:value="formState.password"
            />
          </a-form-item>

          <a-form-item class="m-0" :wrapper-col="{ offset: 0, span: 24 }">
            <div class="pt-2">
              <a-button class="w-full" type="primary" html-type="submit">登陆</a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-config-provider>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { theme, type FormProps } from 'ant-design-vue'
import LoginBg from './LoginBg.vue'
import { useUserStore } from '@/stores/user'
import { APLogin } from '@/api/user/user'

const userStore = useUserStore()

interface IFormState {
  username: string
  password: string
}

const formState = reactive<IFormState>({
  username: '',
  password: '',
})
const router = useRouter()
const onFinish: FormProps['onFinish'] = (values) => {
  APLogin({ userName: formState.username, passWord: formState.password }).then((res) => {
    const { dbId, roleLevel, realName } = res.data
    userStore.setUserInfo({
      dbId,
      roleLevel,
      realName,
    })
    router.replace({ path: '/' })
  })
}

const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

// const mousePoint = ref<{ x: number; y: number }>({
//   x: 0,
//   y: 0,
// })
// const transformComputed = computed(() => {
//   return `transform: rotate3d(0, 1, 0, ${(mousePoint.value.x / window.innerWidth) * 10 - 5}deg)`
// })
// const onMouseMove = (e: MouseEvent) => {
//   mousePoint.value = { x: e.clientX, y: e.clientY }
// }
// onMounted(() => {
//   document.addEventListener('mousemove', onMouseMove)
// })
// onBeforeUnmount(() => {
//   document.removeEventListener('mousemove', onMouseMove)
// })
</script>

<style lang="scss" scoped>
.login-container {
  min-width: 100vw;
  min-height: 100vh;
  /* 景深 */
  // perspective: 500px;
}
.login-wrapper {
  background-color: rgba(#fff, 0.4);
  backdrop-filter: blur(8px);
  width: 400px;
}
</style>
