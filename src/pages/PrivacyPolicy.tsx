import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black text-navy mb-8">Política de <span className="text-emerald">Privacidade</span></h1>
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-navy prose-headings:font-bold">
            <p className="text-slate-600 leading-relaxed mb-6">
              A <strong>Irmandade da Santa Casa de Misericórdia de Paulo de Faria</strong> está comprometida com a proteção de seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>

            <h2 className="text-2xl mt-12 mb-6">1. Coleta de Informações</h2>
            <p className="mb-4">Coletamos informações que você nos fornece voluntariamente através de nossos formulários de contato, ouvidoria e doações, tais como:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Nome completo</li>
              <li>CPF e documentos de identificação (quando necessário)</li>
              <li>E-mail e telefone de contato</li>
              <li>Dados de navegação (Cookies)</li>
            </ul>

            <h2 className="text-2xl mt-12 mb-6">2. Uso dos Dados</h2>
            <p className="mb-6">Seus dados são utilizados estritamente para:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Processar e responder manifestações de Ouvidoria;</li>
              <li>Identificar e processar doações;</li>
              <li>Melhorar a experiência de navegação em nosso portal;</li>
              <li>Cumprir obrigações legais e de transparência pública.</li>
            </ul>

            <h2 className="text-2xl mt-12 mb-6">3. Segurança dos Dados</h2>
            <p className="mb-6">Implementamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acessos não autorizados, perda, alteração ou qualquer forma de tratamento inadequado ou ilícito.</p>

            <h2 className="text-2xl mt-12 mb-6">4. Seus Direitos</h2>
            <p className="mb-6">Conforme a LGPD, você tem direito a confirmar a existência de tratamento, acessar seus dados, corrigir dados incompletos ou desatualizados e solicitar a eliminação de dados desnecessários.</p>

            <h2 className="text-2xl mt-12 mb-6">5. Contato</h2>
            <p className="mb-6">Para qualquer dúvida sobre o tratamento de seus dados, entre em contato com nosso Encarregado de Dados através do telefone (17) 3292-1373 ou em nossa sede administrativa.</p>

            <p className="text-sm text-slate-400 mt-16 italic">Última atualização: 01 de Maio de 2024</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PrivacyPolicy;
