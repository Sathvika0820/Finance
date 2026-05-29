import sys

file_path = r'c:\Users\DELL\OneDrive\Desktop\Finance 3\src\components\AiAssistant.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const labelSource = comparisonEntries[0];
    const loanTypeLabel = labelSource.loanTypeLabel[activeLang] || labelSource.loanTypeLabel.english || loanId.replace(/_/g, " ");
    const rankedLines = comparisonEntries.map((entry, index) => {
      const bank = BANK_BY_ID.get(entry.bankId);
      const bankName = bank ? getBankDisplayName(bank, activeLang) : entry.bankName;
      const rate = entry.numericRate !== null
        ? (entry.interestRateDisplay[activeLang] || entry.interestRateDisplay.english || entry.interestRateText)
        : "Check official website";

      return `${index + 1}. ${bankName} — ${rate}`;
    });

    const lowestVerified = comparisonEntries.find(entry => entry.numericRate !== null);
    const linkedEntry = comparisonEntries.find(entry => entry.verified && entry.officialReferenceLink);
    const linkNote = linkedEntry
      ? `\\n\\nOfficial reference link available for ${BANK_BY_ID.get(linkedEntry.bankId)?.name || linkedEntry.bankName}.`
      : "";

    return {
      text: `Here is the verified ${loanTypeLabel.toLowerCase()} comparison available in BankHub:\\n\\n${rankedLines.join("\\n")}\\n\\nLowest verified rate is shown first.${linkNote}`,
      actionUrl: linkedEntry?.officialReferenceLink || undefined,
      actionLabel: linkedEntry ? `Open official ${lowestVerified?.bankName || linkedEntry.bankName} loan page` : undefined
    };"""

replacement = """    const labelSource = comparisonEntries[0];
    const loanTypeLabel = loanId.replace(/_/g, " ");
    const rankedLines = comparisonEntries.map((entry, index) => {
      const bank = BANK_BY_ID.get(entry.bankId);
      const bankName = bank ? getBankDisplayName(bank, activeLang) : entry.bankName;
      const rate = entry.numericRate !== null
        ? entry.interestRateText
        : "Check official website";

      return `${index + 1}. ${bankName} — ${rate}`;
    });

    const lowestVerified = comparisonEntries.find(entry => entry.numericRate !== null);
    const linkedEntry = comparisonEntries.find(entry => entry.verified && entry.officialLoanPage);
    const linkNote = linkedEntry
      ? `\\n\\nOfficial reference link available for ${BANK_BY_ID.get(linkedEntry.bankId)?.name || linkedEntry.bankName}.`
      : "";

    return {
      text: `Here is the verified ${loanTypeLabel.toLowerCase()} comparison available in BankHub:\\n\\n${rankedLines.join("\\n")}\\n\\nLowest verified rate is shown first.${linkNote}`,
      actionUrl: linkedEntry?.officialLoanPage || undefined,
      actionLabel: linkedEntry ? `Open official ${lowestVerified?.bankName || linkedEntry.bankName} loan page` : undefined
    };"""

target_unix = target.replace('\r\n', '\n')
target_windows = target_unix.replace('\n', '\r\n')

if target_unix in content:
    content = content.replace(target_unix, replacement.replace('\r\n', '\n'))
elif target_windows in content:
    content = content.replace(target_windows, replacement.replace('\n', '\r\n'))
else:
    print('Target not found')
    sys.exit(1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
