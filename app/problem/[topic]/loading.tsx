import * as motion from 'motion/react-client'
export default function LoadingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <p className="animate-pulse text-center text-4xl">문제 생성 중...</p>
      <motion.img
        src="/images/logoicon.png"
        animate={{ rotate: 45 }}
        className="h-32 w-32"
        transition={{ repeat: Infinity, repeatDelay: 0.5 }}
      />
    </div>
  )
}

const box = {
  width: 100,
  height: 100,
  backgroundColor: '#ff0088',
  borderRadius: 5,
}
