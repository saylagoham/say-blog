export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <p className="inline-block chip-yellow text-sm font-mono uppercase tracking-widest px-2.5 py-1 rounded mb-4">About</p>
      <h1 className="text-3xl font-bold mb-6">Say no more</h1>
      <div className="prose-say">
        <p>
          안녕하세요, 세이입니다. 이 사이트는 서울에서 런던으로 향하는 워킹홀리데이 준비 과정과, 그 사이의
          삶, 영어 공부, 돈에 대한 실험, 새로운 도전들을 기록하는 공간입니다.
        </p>
        <p>
          인스타그램이 제 삶의 짧은 조각들을 보여준다면, 여기는 그 뒤에 있는 온전한 이야기를 담습니다.
        </p>
      </div>
    </div>
  );
}
