import { LoaderCircle, Sparkles } from 'lucide-react'
import { FormDialog } from '@/components/form-fields/FormDialog'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/context/walletContext'
import { useFinancialInsight } from '@/hooks/dashboard/useFinancialInsight'
import { formatLocalDate } from '@/utils/formatters'

function InsightList({ title, items }) {
  return (
    <section className="space-y-3">
      <h3 className="font-medium">{title}</h3>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function FinancialInsightDialog({
  open,
  onOpenChange,
  period,
  isReady,
}) {
  const { currentWallet, transactionRevision } = useWallet()
  const { analysis, isStale, isGenerating, errorMessage, generate } =
    useFinancialInsight({
      walletId: currentWallet?.id,
      ...period,
      revision: transactionRevision,
    })
  const canGenerate = !analysis || isStale || Boolean(errorMessage)

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Análise financeira"
      description={`${currentWallet?.name ?? 'Carteira'} · ${formatLocalDate(period.startDate)} a ${formatLocalDate(period.endDate)}`}
      size="lg"
      className="flex flex-col overflow-hidden max-sm:h-dvh max-sm:max-h-dvh max-sm:w-screen max-sm:rounded-none"
    >
      <div
        className="min-h-0 space-y-6 overflow-y-auto pr-1"
        aria-busy={Boolean(isGenerating)}
      >
        <p className="text-muted-foreground text-sm leading-relaxed">
          Ao gerar, os totais, nomes das categorias de despesas e a evolução
          mensal deste período serão enviados ao Gemini para produzir a análise.
          Nomes de membros, e-mails e descrições de transações não são enviados.
        </p>
        {isStale ? (
          <p
            className="rounded-(--radius) border border-amber-500/30 bg-amber-500/10 p-3 text-sm"
            role="status"
          >
            Os dados foram atualizados. Gere uma nova análise para considerar as
            alterações.
          </p>
        ) : null}
        {errorMessage ? (
          <p
            className="text-destructive border-destructive/30 rounded-(--radius) border p-3 text-sm"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
        {isGenerating ? (
          <div
            className="bg-muted flex items-center gap-3 rounded-(--radius) p-4 text-sm"
            role="status"
            aria-live="polite"
          >
            <LoaderCircle
              className="size-5 shrink-0 animate-spin"
              aria-hidden="true"
            />
            Preparando a análise do período. Você pode fechar esta janela e
            voltar em instantes.
          </div>
        ) : null}
        {analysis?.empty ? (
          <p className="bg-muted rounded-(--radius) p-4 text-sm" role="status">
            Não há movimentações neste período. Registre uma transação ou
            selecione outras datas para gerar a análise.
          </p>
        ) : analysis?.analysis ? (
          <div className="space-y-6" aria-live="polite">
            <section className="bg-card space-y-3 rounded-(--radius) border p-4">
              <h3 className="font-medium">Resumo do período</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {analysis.analysis.summary}
              </p>
            </section>
            <InsightList
              title="Observações"
              items={analysis.analysis.observations}
            />
            <InsightList
              title="Sugestões"
              items={analysis.analysis.suggestions}
            />
            <p className="text-muted-foreground text-xs">
              Gerada por IA em{' '}
              {new Date(analysis.generatedAt).toLocaleString('pt-BR')}. Confira
              as observações com os lançamentos da carteira.
            </p>
          </div>
        ) : !isGenerating ? (
          <div className="rounded-(--radius) border border-dashed p-5 text-sm leading-relaxed">
            Veja um resumo das movimentações, os principais pontos de atenção e
            sugestões para organizar o orçamento. A análise considera apenas o
            período selecionado.
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Fechar
        </Button>
        {canGenerate ? (
          <Button
            type="button"
            disabled={!currentWallet || !isReady || isGenerating}
            onClick={() => void generate()}
          >
            {isGenerating ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles aria-hidden="true" />
            )}
            {isGenerating
              ? 'Gerando análise...'
              : isStale
                ? 'Gerar nova análise'
                : errorMessage
                  ? 'Tentar novamente'
                  : 'Gerar análise'}
          </Button>
        ) : null}
      </div>
    </FormDialog>
  )
}
