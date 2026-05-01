import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useEffect } from "react";

const TermsOfUse = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black text-navy mb-8">Termos de <span className="text-emerald">Uso</span></h1>
          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
              Bem-vindo ao Portal de Transparência da Santa Casa de Paulo de Faria. Ao acessar este site, você concorda em cumprir estes termos de uso.
            </p>

            <h2 className="text-2xl font-bold text-navy mt-12 mb-6">1. Aceitação dos Termos</h2>
            <p className="mb-6">O acesso e uso deste portal estão sujeitos aos seguintes termos e condições e a todas as leis aplicáveis. Ao navegar e acessar este site, você aceita, sem limitação ou qualificação, estes Termos de Uso.</p>

            <h2 className="text-2xl font-bold text-navy mt-12 mb-6">2. Uso do Conteúdo</h2>
            <p className="mb-6">Este portal tem como objetivo a transparência pública e a prestação de serviços à comunidade. É permitido visualizar e baixar documentos públicos para fins informativos e pessoais. O uso indevido de dados pessoais de terceiros aqui expostos ou a alteração de documentos oficiais é estritamente proibido.</p>

            <h2 className="text-2xl font-bold text-navy mt-12 mb-6">3. Responsabilidade</h2>
            <p className="mb-6">A Santa Casa de Paulo de Faria envidará esforços para manter as informações deste portal atualizadas e precisas. No entanto, não garantimos a ausência de erros técnicos ou omissões temporárias.</p>

            <h2 className="text-2xl font-bold text-navy mt-12 mb-6">4. Propriedade Intelectual</h2>
            <p className="mb-6">A logomarca, textos e o design deste site são de propriedade da Santa Casa de Paulo de Faria ou de seus respectivos desenvolvedores. A reprodução não autorizada para fins comerciais é proibida.</p>

            <h2 className="text-2xl font-bold text-navy mt-12 mb-6">5. Modificações</h2>
            <p className="mb-6">Reservamo-nos o direito de revisar estes termos a qualquer momento, sem aviso prévio. O uso continuado do site após tais alterações constitui sua aceitação dos novos Termos de Uso.</p>

            <p className="text-sm text-slate-400 mt-16 italic">Última atualização: 01 de Maio de 2024</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TermsOfUse;
