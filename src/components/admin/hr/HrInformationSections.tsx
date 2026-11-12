import type { HrApplication } from '@/types/hr';
import { formatHrDate } from '@/utils/hr';

import { HrDetailSection, HrInfoRow } from './HrDetailShared';
import { BriefcaseBusiness, GraduationCap, UserRound } from 'lucide-react';

export const HrInformationSections = ({ application, fullName }: { application: HrApplication; fullName: string }) => (
    <div className='grid gap-5'>
        <HrDetailSection icon={UserRound} title='Shaxsiy ma’lumotlar'>
            <div className='grid gap-x-7 lg:grid-cols-2'>
                <HrInfoRow label='F.I.Sh.' value={fullName} />
                <HrInfoRow label='Tug‘ilgan sana' value={formatHrDate(application.birthDate)} />
                <HrInfoRow label='Tug‘ilgan joy' value={application.birthPlace} />
                <HrInfoRow label='Telefon' value={application.phone} />
                <HrInfoRow label='Yashash manzili' value={application.currentAddress} />
                <HrInfoRow label='Ro‘yxatdagi manzil' value={application.registeredAddress} />
                <HrInfoRow label='Millati' value={application.nationality} />
                <HrInfoRow label='Fuqaroligi' value={application.citizenship} />
                <HrInfoRow label='Oilaviy holati' value={application.maritalStatus} />
                <HrInfoRow label='Pasport' value={[application.passport?.series, application.passport?.number].filter(Boolean).join(' ')} />
                <HrInfoRow label='Pasport berilgan sana' value={formatHrDate(application.passport?.issuedAt)} />
                <HrInfoRow label='Kim tomonidan berilgan' value={application.passport?.issuedBy} />
                <HrInfoRow label='Bo‘yi / og‘irligi' value={`${application.heightCm || '—'} sm / ${application.weightKg || '—'} kg`} />
                <HrInfoRow label='Kiyim / poyabzal' value={`${application.clothingSize || '—'} / ${application.shoeSize || '—'}`} />
            </div>
        </HrDetailSection>

        <HrDetailSection icon={GraduationCap} title='Ta’lim va qiziqishlar'>
            <div className='grid gap-x-7 lg:grid-cols-2'>
                <HrInfoRow label='O‘quv muassasasi' value={application.education?.institution} />
                <HrInfoRow label='Fakultet' value={application.education?.faculty} />
                <HrInfoRow label='Yo‘nalish' value={application.education?.fieldOfStudy} />
                <HrInfoRow label='Mutaxassislik' value={application.education?.specialty} />
                <HrInfoRow label='Bitirgan yili' value={application.education?.graduationYear} />
                <HrInfoRow label='Qo‘shimcha ta’lim' value={application.additionalEducation?.join(', ')} />
                <HrInfoRow label='Xobbi' value={application.hobbies?.join(', ')} />
                <HrInfoRow label='Mutolaa qilgan kitoblari' value={application.recentlyReadBooks} />
                <HrInfoRow label='Sport' value={application.sports} />
            </div>
        </HrDetailSection>

        <HrDetailSection icon={BriefcaseBusiness} title='Ish tajribasi'>
            <div className='overflow-x-auto'>
                <table className='w-full min-w-[720px] text-left text-sm'>
                    <thead className='border-b border-base-300 text-xs uppercase text-admin-dim'><tr><th className='py-3 pr-4'>Tashkilot</th><th className='p-3'>Davri</th><th className='p-3'>Lavozim</th><th className='p-3'>Ketish sababi</th></tr></thead>
                    <tbody>
                        {application.workExperience?.length ? application.workExperience.map((item, index) => (
                            <tr key={index} className='border-b border-base-300 last:border-0'><td className='py-3 pr-4 font-black'>{item.organization || '—'}</td><td className='p-3'>{formatHrDate(item.startedAt)} — {formatHrDate(item.endedAt)}</td><td className='p-3 font-bold'>{item.position || '—'}</td><td className='p-3'>{item.leavingReason || '—'}</td></tr>
                        )) : <tr><td colSpan={4} className='py-8 text-center font-bold text-admin-dim'>Ish tajribasi kiritilmagan.</td></tr>}
                    </tbody>
                </table>
            </div>
        </HrDetailSection>
    </div>
);
