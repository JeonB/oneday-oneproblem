import React from 'react'

export const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        color: '#212529',
        padding: '10px 0',
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div>
              <p style={{ fontSize: '13px' }}>
                <span className="footSpan">주소 : 서울 관악구 행운4길</span>
              </p>
            </div>

            <div>
              <p style={{ marginTop: '15px', fontSize: '13px' }}>
                <span className="footSpan">대표번호 : 010-4233-5481</span>
              </p>
            </div>
          </div>

          <div>
            <div>
              <p style={{ fontSize: '13px' }}>
                <span className="footSpan">
                  본 사이트의 콘텐츠는 저작권법의 보호를 받는바, 무단 전재,
                  복사, 배포 등을 금합니다.
                </span>
              </p>
            </div>
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '13px' }}>
                <span className="footSpan">
                  &copy; 2001 - {new Date().getFullYear()} JeonB All Rights
                  Reserved.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
