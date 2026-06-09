// Canonical, de-duplicated taxonomy values for the VERIFY data layer.
// These slugs are the stable keys that specialist seed data references —
// edit labels freely in the admin, but keep the slugs if you re-seed.

export type Term = { title: string; slug: string }

export const SPECIALTIES: Term[] = [
  { title: 'Orthopaedic Surgery', slug: 'orthopaedic-surgery' },
  { title: 'Spinal Surgery', slug: 'spinal-surgery' },
  { title: 'Hand & Upper-Limb Surgery', slug: 'hand-upper-limb-surgery' },
  { title: 'Hip & Knee Arthroplasty', slug: 'hip-knee-arthroplasty' },
  { title: 'Foot, Ankle & Trauma Surgery', slug: 'foot-ankle-trauma-surgery' },
  { title: 'Forensic Psychiatry', slug: 'forensic-psychiatry' },
  { title: 'Adult Psychiatry', slug: 'adult-psychiatry' },
  { title: 'Child & Adolescent Psychiatry', slug: 'child-adolescent-psychiatry' },
  { title: 'Clinical & Consulting Psychology', slug: 'clinical-consulting-psychology' },
  { title: 'Neurology', slug: 'neurology' },
  { title: 'General & Colorectal Surgery', slug: 'general-colorectal-surgery' },
  { title: 'Ophthalmology', slug: 'ophthalmology' },
  { title: 'Dermatology', slug: 'dermatology' },
  { title: 'ENT / Otolaryngology', slug: 'ent-otolaryngology' },
  { title: 'Pain Medicine & Anaesthesia', slug: 'pain-medicine-anaesthesia' },
  { title: 'Respiratory & Sleep Medicine', slug: 'respiratory-sleep-medicine' },
  { title: 'Endocrinology & General Medicine', slug: 'endocrinology-general-medicine' },
  { title: 'Oral & Maxillofacial Surgery', slug: 'oral-maxillofacial-surgery' },
  { title: 'Occupational Therapy', slug: 'occupational-therapy' },
]

export const CLAIM_TYPES: Term[] = [
  { title: "Workers' Compensation", slug: 'workers-compensation' },
  { title: 'CTP / Motor Vehicle Accident', slug: 'ctp-motor-vehicle-accident' },
  { title: 'Public Liability', slug: 'public-liability' },
  { title: 'Medical Negligence', slug: 'medical-negligence' },
  { title: 'Total & Permanent Disability (TPD)', slug: 'tpd' },
  { title: 'Dust Diseases', slug: 'dust-diseases' },
  { title: 'Historical & Institutional Abuse', slug: 'historical-institutional-abuse' },
  { title: 'Income Protection', slug: 'income-protection' },
]

export const ASSESSMENT_TYPES: Term[] = [
  { title: 'Independent Medical Examination (IME)', slug: 'ime' },
  { title: 'Joint Medical Examination (JME)', slug: 'jme' },
  { title: 'File Review', slug: 'file-review' },
  { title: 'Supplementary Report', slug: 'supplementary-report' },
  { title: 'Expert Evidence / Witness', slug: 'expert-evidence' },
  { title: 'Teleconference', slug: 'teleconference' },
  { title: 'Videolink Assessment', slug: 'videolink-assessment' },
  { title: 'Fitness-for-Work Assessment', slug: 'fitness-for-work' },
  { title: 'Home Visit', slug: 'home-visit' },
  { title: 'Prison Assessment', slug: 'prison-assessment' },
]

// Clinical conditions / body-regions. De-duplicated from the reference; grouped
// here by discipline only for readability (the collection itself is flat).
export const AREAS_OF_EXPERTISE: Term[] = [
  // Spine & orthopaedics
  { title: 'Spine', slug: 'spine' },
  { title: 'Adult Spinal Pathology', slug: 'adult-spinal-pathology' },
  { title: 'Paediatric Spinal Pathology', slug: 'paediatric-spinal-pathology' },
  { title: 'Degenerative Disc Disease', slug: 'degenerative-disc-disease' },
  { title: 'Hand', slug: 'hand' },
  { title: 'Wrist', slug: 'wrist' },
  { title: 'Elbow', slug: 'elbow' },
  { title: 'Shoulder', slug: 'shoulder' },
  { title: 'Upper Limb', slug: 'upper-limb' },
  { title: 'Hip', slug: 'hip' },
  { title: 'Knee', slug: 'knee' },
  { title: 'Foot', slug: 'foot' },
  { title: 'Ankle', slug: 'ankle' },
  { title: 'Lower Limb', slug: 'lower-limb' },
  { title: 'Pelvis', slug: 'pelvis' },
  { title: 'Joint Replacement', slug: 'joint-replacement' },
  { title: 'Sports Injury', slug: 'sports-injury' },
  { title: 'Trauma', slug: 'trauma' },
  { title: 'Musculoskeletal Injuries', slug: 'musculoskeletal-injuries' },
  { title: 'Lower Limb Reconstruction', slug: 'lower-limb-reconstruction' },
  { title: 'Paediatric Knee Conditions', slug: 'paediatric-knee-conditions' },
  // Psychiatry & psychology
  { title: 'General Adult Psychiatry', slug: 'general-adult-psychiatry' },
  { title: 'Occupational Psychiatry', slug: 'occupational-psychiatry' },
  { title: 'Psychotherapy', slug: 'psychotherapy' },
  { title: 'Anxiety Disorders', slug: 'anxiety-disorders' },
  { title: 'Depression', slug: 'depression' },
  { title: 'Bipolar Disorder', slug: 'bipolar-disorder' },
  { title: 'Adjustment Disorder / Stress', slug: 'adjustment-disorder' },
  { title: 'PTSD', slug: 'ptsd' },
  { title: 'ADHD', slug: 'adhd' },
  { title: 'Autism Spectrum Disorder (ASD)', slug: 'asd' },
  { title: 'Eating & Feeding Disorders', slug: 'eating-feeding-disorders' },
  { title: 'Alcohol & Drug Use Disorders', slug: 'alcohol-drug-use-disorders' },
  { title: 'Prolonged Grief', slug: 'prolonged-grief' },
  { title: 'Family Therapy', slug: 'family-therapy' },
  { title: 'Sexual Abuse', slug: 'sexual-abuse' },
  { title: 'Abuse & Institutional Abuse Matters', slug: 'abuse-institutional-matters' },
  { title: 'Capacity', slug: 'capacity' },
  { title: 'Psychological Fitness Assessments', slug: 'psychological-fitness-assessments' },
  { title: 'Mental Health', slug: 'mental-health' },
  // Neurology
  { title: 'Neuromuscular Disorders', slug: 'neuromuscular-disorders' },
  { title: 'Clinical Neurophysiology', slug: 'clinical-neurophysiology' },
  { title: 'Chronic Migraine', slug: 'chronic-migraine' },
  { title: 'Headaches', slug: 'headaches' },
  // Respiratory & sleep
  { title: 'Occupational Lung Diseases', slug: 'occupational-lung-diseases' },
  { title: 'Chronic & Acute Respiratory Failure', slug: 'respiratory-failure' },
  { title: 'Diffuse Interstitial Lung Disease', slug: 'interstitial-lung-disease' },
  { title: 'Lung Cancer', slug: 'lung-cancer' },
  { title: 'Lung Disorders', slug: 'lung-disorders' },
  { title: 'Tuberculosis', slug: 'tuberculosis' },
  { title: 'COPD', slug: 'copd' },
  { title: 'Sleep Disordered Breathing', slug: 'sleep-disordered-breathing' },
  // General & colorectal surgery
  { title: 'General Surgery', slug: 'general-surgery' },
  { title: 'Hernia', slug: 'hernia' },
  { title: 'Colorectal & Bowel Disease', slug: 'colorectal-bowel-disease' },
  { title: 'Testicular Disease', slug: 'testicular-disease' },
  { title: 'Gastrointestinal System', slug: 'gastrointestinal-system' },
  { title: 'Colonoscopy & Capsule Endoscopy', slug: 'colonoscopy-capsule-endoscopy' },
  { title: 'Anorectal Ultrasonography', slug: 'anorectal-ultrasonography' },
  // Ophthalmology
  { title: 'Cataract Surgery', slug: 'cataract-surgery' },
  { title: 'Glaucoma', slug: 'glaucoma' },
  { title: 'Diabetic Retinopathy', slug: 'diabetic-retinopathy' },
  { title: 'Age-related Macular Degeneration', slug: 'macular-degeneration' },
  { title: 'Oculoplastics', slug: 'oculoplastics' },
  // Dermatology
  { title: 'Contact Dermatitis', slug: 'contact-dermatitis' },
  { title: 'Skin Cancer', slug: 'skin-cancer' },
  { title: 'Facial Skin Conditions', slug: 'facial-skin-conditions' },
  { title: 'Nail & Hair Disorders', slug: 'nail-hair-disorders' },
  // ENT
  { title: 'Otology (Ear)', slug: 'otology' },
  { title: 'Rhinology (Nose)', slug: 'rhinology' },
  { title: 'Laryngology (Throat)', slug: 'laryngology' },
  { title: 'Head & Neck Surgery', slug: 'head-neck-surgery' },
  // Pain medicine
  { title: 'Persistent Post-Surgical & Post-Traumatic Pain', slug: 'post-surgical-pain' },
  { title: 'Musculoskeletal & Joint Pain', slug: 'musculoskeletal-joint-pain' },
  { title: 'Neuropathic Pain', slug: 'neuropathic-pain' },
  { title: 'Minimally Invasive Interventions', slug: 'minimally-invasive-interventions' },
  { title: 'Spinal & Peripheral Nerve Stimulation', slug: 'nerve-stimulation' },
  // Endocrinology & general medicine
  { title: 'Endocrinology, including Diabetes', slug: 'endocrinology-diabetes' },
  { title: 'General Medicine', slug: 'general-medicine' },
  // Oral & maxillofacial
  { title: 'Facial Trauma', slug: 'facial-trauma' },
  { title: 'Dental Implants', slug: 'dental-implants' },
  { title: 'Dentoalveolar Surgery', slug: 'dentoalveolar-surgery' },
  { title: 'Oral Pathology', slug: 'oral-pathology' },
  { title: 'Orthognathic Surgery', slug: 'orthognathic-surgery' },
  // Occupational therapy & functional
  { title: 'Complex Rehabilitation', slug: 'complex-rehabilitation' },
  { title: 'Pre-Employment Assessments', slug: 'pre-employment-assessments' },
  { title: 'Fitness for Duty Assessments', slug: 'fitness-for-duty-assessments' },
  { title: 'Functional Medicine', slug: 'functional-medicine' },
  { title: 'Return-to-Work Planning', slug: 'return-to-work-planning' },
]
