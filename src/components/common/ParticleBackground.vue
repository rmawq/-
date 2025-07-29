<template>
  <div class="particle-background" ref="particleContainer"></div>
</template>

<script>
export default {
  name: 'ParticleBackground',
  props: {
    color: {
      type: String,
      default: '#FFA80A'
    },
    particleCount: {
      type: Number,
      default: 80
    },
    speed: {
      type: Number,
      default: 1
    },
    opacity: {
      type: Number,
      default: 0.6
    }
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      particles: [],
      animationFrameId: null,
      width: 0,
      height: 0
    }
  },
  mounted() {
    console.log('ParticleBackground 组件已挂载')
    this.initCanvas()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    console.log('ParticleBackground 组件准备销毁')
    window.removeEventListener('resize', this.handleResize)
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
  },
  methods: {
    initCanvas() {
      console.log('初始化Canvas')
      const container = this.$refs.particleContainer
      if (!container) {
        console.error('找不到粒子容器元素')
        return
      }
      
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')
      container.appendChild(this.canvas)
      
      this.handleResize()
      this.createParticles()
      this.animate()
      
      console.log('粒子背景初始化完成', {
        width: this.width,
        height: this.height,
        particleCount: this.particleCount
      })
    },
    handleResize() {
      if (!this.canvas || !this.$refs.particleContainer) {
        console.error('Canvas或容器不存在')
        return
      }
      
      const container = this.$refs.particleContainer
      const rect = container.getBoundingClientRect()
      this.width = rect.width || window.innerWidth
      this.height = rect.height || window.innerHeight
      
      // 确保容器有尺寸
      if (this.width === 0 || this.height === 0) {
        this.width = window.innerWidth
        this.height = window.innerHeight
        console.warn('容器尺寸为0，使用窗口尺寸', this.width, this.height)
      }
      
      this.canvas.width = this.width
      this.canvas.height = this.height
      
      // 重新创建粒子
      this.createParticles()
    },
    createParticles() {
      this.particles = []
      
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * this.speed,
          speedY: (Math.random() - 0.5) * this.speed,
          opacity: Math.random() * this.opacity + 0.1
        })
      }
    },
    drawParticles() {
      if (!this.ctx) {
        console.error('绘制上下文不存在')
        return
      }
      
      this.ctx.clearRect(0, 0, this.width, this.height)
      
      this.particles.forEach(particle => {
        this.ctx.beginPath()
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        this.ctx.fillStyle = this.hexToRgba(this.color, particle.opacity)
        this.ctx.fill()
        
        // 连接线条
        this.connectParticles(particle)
        
        // 更新位置
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // 边界检测
        if (particle.x < 0 || particle.x > this.width) {
          particle.speedX = -particle.speedX
        }
        
        if (particle.y < 0 || particle.y > this.height) {
          particle.speedY = -particle.speedY
        }
      })
    },
    connectParticles(p1) {
      this.particles.forEach(p2 => {
        if (p1 === p2) return
        
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          // 距离越近，线条越明显
          const opacity = (1 - distance / 100) * 0.2
          
          this.ctx.beginPath()
          this.ctx.strokeStyle = this.hexToRgba(this.color, opacity)
          this.ctx.lineWidth = 0.5
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.stroke()
        }
      })
    },
    animate() {
      this.drawParticles()
      this.animationFrameId = requestAnimationFrame(this.animate)
    },
    hexToRgba(hex, opacity) {
      let r = 0, g = 0, b = 0
      
      // 3 digits
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16)
        g = parseInt(hex[2] + hex[2], 16)
        b = parseInt(hex[3] + hex[3], 16)
      } 
      // 6 digits
      else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16)
        g = parseInt(hex.substring(3, 5), 16)
        b = parseInt(hex.substring(5, 7), 16)
      }
      
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
  }
}
</script>

<style scoped>
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  background-color: transparent;
}
</style> 