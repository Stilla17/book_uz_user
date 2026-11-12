'use client';

import { useHrApplicationForm } from '@/hooks/hr/useHrApplicationForm';

import { PassportSection, PersonalSection } from './PersonalSections';
import { EducationSection, InterestsSection } from './ProfileSections';
import { HrPageHeader, SubmitPanel, SuccessPanel } from './SubmissionPanels';
import { WorkExperienceSection } from './WorkExperienceSection';

export const HrApplicationForm = () => {
    const form = useHrApplicationForm();

    if (form.applicationNumber) return <SuccessPanel applicationNumber={form.applicationNumber} />;

    return (
        <main className='min-h-screen bg-[#f4eadc] text-[#2f2a25]'>
            <HrPageHeader />
            <div className='mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10'>
                <form onSubmit={form.submit} className='grid gap-5'>
                    <PersonalSection register={form.register} photoPreview={form.photoPreview} changePhoto={form.changePhoto} />
                    <PassportSection register={form.register} />
                    <EducationSection register={form.register} />
                    <InterestsSection register={form.register} />
                    <WorkExperienceSection register={form.register} fields={form.experienceFields} append={form.appendExperience} remove={form.removeExperience} />
                    <SubmitPanel register={form.register} errors={form.errors} errorMessage={form.errorMessage} isSubmitting={form.isSubmitting} />
                </form>
            </div>
        </main>
    );
};
