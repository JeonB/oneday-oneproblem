import classes from './loading.module.css'
export default function LoadingPage() {
  return (
    <div className={classes[`loading-container`]}>
      <p className={classes.loading}>문제 생성 중...</p>
    </div>
  )
}
