const images = (slug, count = 3) =>
  Array.from(
    { length: count },
    (_, index) => `https://picsum.photos/seed/${slug}-${index + 1}/600/600`,
  )

export const mockProducts = [
  {
    id: 'p1',
    name: 'طقم سكراب طبي',
    description:
      'طقم سكراب طبي مكون من قطعتين (بلوزة وبنطال) من قماش مريح وسهل التنظيف، مناسب للأطباء والتمريض والطلاب.',
    category: 'scrubs',
    price: 450,
    images: images('scrub-set', 3),
    isActive: true,
    createdAt: '2024-01-10T09:00:00.000Z',
    variants: [
      { id: 'p1-v1', productId: 'p1', size: 'S', color: 'أبيض', stock: 5 },
      { id: 'p1-v2', productId: 'p1', size: 'M', color: 'كحلي', stock: 8 },
      { id: 'p1-v3', productId: 'p1', size: 'L', color: 'أخضر زيتي', stock: 0 },
    ],
  },
  {
    id: 'p2',
    name: 'طقم سكراب نسائي',
    description:
      'طقم سكراب نسائي بقصة أنيقة وخامة عالية الجودة، متوفر بعدة ألوان ومقاسات مريحة.',
    category: 'scrubs',
    price: 480,
    images: images('scrub-women', 3),
    isActive: true,
    createdAt: '2024-01-12T09:00:00.000Z',
    variants: [
      { id: 'p2-v1', productId: 'p2', size: 'S', color: 'وردي', stock: 4 },
      { id: 'p2-v2', productId: 'p2', size: 'M', color: 'وردي', stock: 6 },
      { id: 'p2-v3', productId: 'p2', size: 'XL', color: 'أبيض', stock: 0 },
    ],
  },
  {
    id: 'p3',
    name: 'بالطو طبي',
    description:
      'بالطو طبي أبيض كلاسيكي بجيوب عملية وأزرار أمامية، مناسب للاستخدام اليومي في المستشفيات والعيادات.',
    category: 'scrubs',
    price: 520,
    images: images('lab-coat', 3),
    isActive: true,
    createdAt: '2024-01-15T09:00:00.000Z',
    variants: [
      { id: 'p3-v1', productId: 'p3', size: 'M', color: 'أبيض', stock: 7 },
      { id: 'p3-v2', productId: 'p3', size: 'L', color: 'أبيض', stock: 5 },
      { id: 'p3-v3', productId: 'p3', size: 'XXL', color: 'أبيض', stock: 2 },
    ],
  },
  {
    id: 'p4',
    name: 'يونيفورم تمريض',
    description:
      'يونيفورم تمريض عملي بخامة متينة وقابلة للغسل المتكرر، يوفر حركة مريحة خلال ساعات العمل الطويلة.',
    category: 'scrubs',
    price: 400,
    images: images('nurse-uniform', 2),
    isActive: true,
    createdAt: '2024-01-18T09:00:00.000Z',
    variants: [
      { id: 'p4-v1', productId: 'p4', size: 'S', color: 'أخضر زيتي', stock: 3 },
      { id: 'p4-v2', productId: 'p4', size: 'M', color: 'أخضر زيتي', stock: 0 },
      { id: 'p4-v3', productId: 'p4', size: 'L', color: 'كحلي', stock: 6 },
    ],
  },
  {
    id: 'p5',
    name: 'كلوج طبي',
    description:
      'حذاء طبي على شكل كلوج بنعل مضاد للانزلاق ووسادة مريحة، مناسب للوقوف الطويل داخل المستشفى.',
    category: 'footwear',
    price: 350,
    images: images('medical-clogs', 3),
    isActive: true,
    createdAt: '2024-02-01T09:00:00.000Z',
    variants: [
      { id: 'p5-v1', productId: 'p5', size: '38', color: 'أسود', stock: 5 },
      { id: 'p5-v2', productId: 'p5', size: '40', color: 'أسود', stock: 8 },
      { id: 'p5-v3', productId: 'p5', size: '42', color: 'أبيض', stock: 0 },
    ],
  },
  {
    id: 'p6',
    name: 'حذاء طبي مريح',
    description:
      'حذاء طبي خفيف الوزن بخامة تسمح بالتهوية، يمنح دعماً جيداً للقدم خلال المناوبات الطويلة.',
    category: 'footwear',
    price: 620,
    images: images('medical-shoes', 3),
    isActive: true,
    createdAt: '2024-02-05T09:00:00.000Z',
    variants: [
      { id: 'p6-v1', productId: 'p6', size: '39', color: 'أبيض', stock: 4 },
      { id: 'p6-v2', productId: 'p6', size: '41', color: 'أسود', stock: 6 },
      { id: 'p6-v3', productId: 'p6', size: '43', color: 'أسود', stock: 0 },
    ],
  },
  {
    id: 'p7',
    name: 'بكرة بادج طبية',
    description:
      'بكرة بادج قابلة للسحب بسلك متين ومشبك دوّار، لتثبيت بطاقة الهوية بسهولة على الزي الطبي.',
    category: 'accessories',
    price: 90,
    images: images('badge-reel', 2),
    isActive: true,
    createdAt: '2024-02-10T09:00:00.000Z',
    variants: [
      { id: 'p7-v1', productId: 'p7', size: 'مقاس واحد', color: 'أسود', stock: 20 },
      { id: 'p7-v2', productId: 'p7', size: 'مقاس واحد', color: 'كحلي', stock: 15 },
      { id: 'p7-v3', productId: 'p7', size: 'مقاس واحد', color: 'أبيض', stock: 0 },
    ],
  },
  {
    id: 'p8',
    name: 'ساعة تمريض',
    description:
      'ساعة تمريض مقاومة للماء مع عقرب ثواني واضح، مثالية لقياس النبض ومتابعة المواعيد الطبية.',
    category: 'accessories',
    price: 150,
    images: images('nurse-watch', 3),
    isActive: true,
    createdAt: '2024-02-14T09:00:00.000Z',
    variants: [
      { id: 'p8-v1', productId: 'p8', size: 'مقاس واحد', color: 'أبيض', stock: 10 },
      { id: 'p8-v2', productId: 'p8', size: 'مقاس واحد', color: 'أسود', stock: 7 },
      { id: 'p8-v3', productId: 'p8', size: 'مقاس واحد', color: 'كحلي', stock: 0 },
    ],
  },
  {
    id: 'p9',
    name: 'علبة سماعة طبية',
    description:
      'علبة سماعة طبية بحماية داخلية تحافظ على السماعة من الصدمات والخدوش، بغطاء بسحّاب عملي.',
    category: 'accessories',
    price: 130,
    images: images('stethoscope-case', 2),
    isActive: true,
    createdAt: '2024-02-20T09:00:00.000Z',
    variants: [
      { id: 'p9-v1', productId: 'p9', size: 'مقاس واحد', color: 'أسود', stock: 9 },
      { id: 'p9-v2', productId: 'p9', size: 'مقاس واحد', color: 'كحلي', stock: 0 },
    ],
  },
  {
    id: 'p10',
    name: 'حقيبة طبية',
    description:
      'حقيبة طبية متعددة الجيوب بحجم مناسب لحمل الأدوات والمستلزمات اليومية، بخامة متينة وسهلة الحمل.',
    category: 'accessories',
    price: 280,
    images: images('medical-bag', 3),
    isActive: true,
    createdAt: '2024-02-25T09:00:00.000Z',
    variants: [
      { id: 'p10-v1', productId: 'p10', size: 'مقاس واحد', color: 'أسود', stock: 6 },
      { id: 'p10-v2', productId: 'p10', size: 'مقاس واحد', color: 'كحلي', stock: 4 },
      { id: 'p10-v3', productId: 'p10', size: 'مقاس واحد', color: 'أخضر زيتي', stock: 0 },
    ],
  },
]

export default mockProducts
