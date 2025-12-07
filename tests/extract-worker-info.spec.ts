import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Extract Worker Information', () => {
  test('should extract all worker data from the page', async ({ page }) => {
    // Configuration
    const outputDir = path.join(process.cwd(), 'output');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(outputDir, `worker-data-${timestamp}.json`);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Wait for manual login - user should navigate to the worker page
    console.log('\n⏳ Please log in manually and navigate to the worker page...');
    console.log('⏳ The script will wait for the page to be ready...\n');

    // Wait for the main form to be present (indicates we're on the worker page)
    await page.waitForSelector('.tab-content', { timeout: 120000 });
    
    console.log('✅ Worker page detected! Starting extraction...\n');

    // Helper function to extract form field value
    const getFieldValue = async (selector: string): Promise<string> => {
      try {
        const element = await page.$(selector);
        if (!element) return '';
        
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'input' || tagName === 'textarea') {
          return await element.inputValue() || '';
        } else if (tagName === 'select') {
          const selectedOption = await element.$('option:checked');
          if (selectedOption) {
            return await selectedOption.textContent() || '';
          }
        }
        return await element.textContent() || '';
      } catch (error) {
        return '';
      }
    };

    // Helper function to extract grid/table data
    const extractGridData = async (gridId: string): Promise<any[]> => {
      try {
        const rows = await page.$$(`#${gridId} tbody tr:not(.jqgfirstrow):not(#epgGridMessage_${gridId})`);
        const data: any[] = [];

        for (const row of rows) {
          const cells = await row.$$('td');
          const rowData: any = {};
          
          for (let i = 0; i < cells.length; i++) {
            const cellText = await cells[i].textContent();
            rowData[`column_${i}`] = cellText?.trim() || '';
          }
          
          if (Object.values(rowData).some(val => val !== '')) {
            data.push(rowData);
          }
        }

        return data;
      } catch (error) {
        return [];
      }
    };

    // Extract all data
    const workerData = {
      extractionDate: new Date().toISOString(),
      workerInfo: {
        // Données d'identification
        identification: {
          nom: await getFieldValue('#wknFamilienaam'),
          prenom: await getFieldValue('#wknVoornaam'),
          initialeDeuxiemePrenom: await getFieldValue('#wknInitiaalWkn'),
          rue: await getFieldValue('#wknStraat'),
          numeroMaison: await getFieldValue('#wknHuisnr'),
          numeroBoite: await getFieldValue('#wknBusnr'),
          codePostal: await getFieldValue('#wknPostnr'),
          localite: await getFieldValue('#wknLocal'),
          codePaysDomicile: await getFieldValue('#wknLandcode'),
          codePaysNationalite: await getFieldValue('#wknLandcodeNatio'),
          numeroRegistreNational: await getFieldValue('#wknRyksNr'),
          numeroCarteIdentite: await getFieldValue('#wknNrIdent'),
          dateNaissance: await getFieldValue('#wknGebDat'),
          lieuNaissance: await getFieldValue('#wknGebPl'),
          codePaysLieuNaissance: await getFieldValue('#wknLandcodeGebpl'),
          sexe: await getFieldValue('#wknCGeslacht'),
          handicape: await getFieldValue('#wknCHand'),
          kmDomicileTravail: await getFieldValue('#wknKilom'),
          moyenTransport: await getFieldValue('#wknCVerplMiddel'),
          kmDomicileTravailVelo: await getFieldValue('#wknKilomFiets'),
          prepensionEtranger: await getFieldValue('#wknBtlBp'),
        },

        // Données supplémentaires
        additionalData: {
          personneMorale: await getFieldValue('#wknCRechtspersoon'),
          numeroEntreprise: await getFieldValue('#wknOndernemingsnr'),
          numeroIdentificationFiscale: await getFieldValue('#wknFINNr'),
          numeroAffiliationMutualite: await getFieldValue('#wknMutInschrNr'),
          telephone: await getFieldValue('#wknTel'),
          telephonePrive: await getFieldValue('#wknTelPriv'),
          faxGsm: await getFieldValue('#wknFax'),
          gsmPrive: await getFieldValue('#wknGsmPriv'),
          numeroUrgence: await getFieldValue('#wknNoodnr'),
          email: await getFieldValue('#wknEmail'),
          emailPrive: await getFieldValue('#wknEmailPriv'),
        },

        // Données du contrat
        contractData: {
          dateEntree: await getFieldValue('#wknDatInd'),
          dateSortie: await getFieldValue('#wknDatUitd'),
          datePremiereEmbauche826: await getFieldValue('#wknDatEaw826'),
          raisonSortie: await getFieldValue('#wknCOntslag'),
          dateInterimaire: await getFieldValue('#wknDatUitzend'),
          fusionRepriseCCT32bis: await getFieldValue('#wknCao32'),
          langue: await getFieldValue('#wknCTaal'),
          langueRegionale: await getFieldValue('#wknCStreektaal'),
          fichePaieAnglais: await getFieldValue('#wknCEngels'),
          caisseAssuranceGroupe: await getFieldValue('#wknGverzKas'),
          pasPensionSectorielleDepuisTrimestre: await getFieldValue('#wknGnSpfVaKwt'),
        },

        // Données familiales
        familyData: {
          etatCivil: await getFieldValue('#wknCBurgs'),
          dateEtatCivil: await getFieldValue('#wknDatHuwelijk'),
          nomPartenaire: await getFieldValue('#wknEgaNaam'),
          dateNaissancePartenaire: await getFieldValue('#wknEgaGdat'),
          sexePartenaire: await getFieldValue('#wknEgaCGeslacht'),
          professionPartenaire: await getFieldValue('#wknEgaBerp'),
          revenusPartenaire: await getFieldValue('#wknLoonEchtgenote'),
          partenaireACharge: await getFieldValue('#wknPtlE'),
          partenaireHandicape: await getFieldValue('#wknPtlEHand'),
          nombreEnfants: await getFieldValue('#wknPtlK'),
          nombreEnfantsHandicapes: await getFieldValue('#wknPtlG'),
          nombreAutresMoins65: await getFieldValue('#wknPtlA'),
          nombreAutresMoins65Handicapes: await getFieldValue('#wknPtlAHand'),
          nombreAutresPlus65: await getFieldValue('#wknPtlA65'),
          nombreAutresPlus65Handicapes: await getFieldValue('#wknPtlAHand65'),
          nombreAutresPlus65Dependance: await getFieldValue('#wknPtlAZorg65'),
          nombreTotalPersonnesACharge: await getFieldValue('#wknPtlT'),
          beneficiaireAllocationsFamiliales: await getFieldValue('#wknCKinderbysl'),
          numeroAllocationsFamiliales: await getFieldValue('#wknNrKbysl'),
          chargeFamilleONEM: await getFieldValue('#wknRvaGl'),
        },

        // Données de paiement
        paymentData: {
          typePaiement: await getFieldValue('#wknCBetaal'),
          numeroCompteBE: await getFieldValue('#wknBankNr'),
          iban: await getFieldValue('#wknIban'),
          beneficiaire: await getFieldValue('#wknBegunst'),
        },

        // Saisie sur salaire
        wageGarnishment: {
          saisie: await getFieldValue('#wknCLoonb'),
          totalSaisie: await getFieldValue('#wknLoonb'),
          cumulSaisie: await getFieldValue('#wknKumLoonb'),
          saisieMensuelle: await getFieldValue('#wknMaandLoonb'),
          pensionAlimentaire: await getFieldValue('#wknAlimentatie'),
          creancier: await getFieldValue('#wknSchuldeLoonb'),
          enfantsACharge: await getFieldValue('#wknKtlLoonb'),
          secalDepuis: await getFieldValue('#wknDavoVanaf'),
        },

        // Infos supplémentaires
        additionalInfo: {
          numerique1: await getFieldValue('#xwnNumeriek1'),
          numerique2: await getFieldValue('#xwnNumeriek2'),
          numerique3: await getFieldValue('#xwnNumeriek3'),
          numerique4: await getFieldValue('#xwnNumeriek4'),
          numerique5: await getFieldValue('#xwnNumeriek5'),
          numerique6: await getFieldValue('#xwnNumeriek6'),
          numerique7: await getFieldValue('#xwnNumeriek7'),
          numerique8: await getFieldValue('#xwnNumeriek8'),
          numerique9: await getFieldValue('#xwnNumeriek9'),
          numerique10: await getFieldValue('#xwnNumeriek10'),
          numerique11: await getFieldValue('#xwnNumeriek11'),
          numerique12: await getFieldValue('#xwnNumeriek12'),
          numerique13: await getFieldValue('#xwnNumeriek13'),
          numerique14: await getFieldValue('#xwnNumeriek14'),
          alphanumerique1: await getFieldValue('#xwnAlfanumeriek1'),
          alphanumerique2: await getFieldValue('#xwnAlfanumeriek2'),
          alphanumerique3: await getFieldValue('#xwnAlfanumeriek3'),
          alphanumerique4: await getFieldValue('#xwnAlfanumeriek4'),
          alphanumerique5: await getFieldValue('#xwnAlfanumeriek5'),
          alphanumerique6: await getFieldValue('#xwnAlfanumeriek6'),
          alphanumerique7: await getFieldValue('#xwnAlfanumeriek7'),
          memo: await getFieldValue('#xwnMemo'),
        },

        // Catégories
        categories: {
          acces: await getFieldValue('#wknCategSecurity'),
        },

        // Grilles de données
        dimonaPeriods: await extractGridData('dimGridTable'),
        protectedWorker: await extractGridData('bshGridTable'),
        contracts: await extractGridData('conGridTable'),
      },
    };

    // Save to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(workerData, null, 2), 'utf-8');

    console.log('✅ Extraction completed successfully!');
    console.log(`📁 Data saved to: ${outputFile}\n`);

    // Display summary
    console.log('📊 Extraction Summary:');
    console.log(`   - Worker: ${workerData.workerInfo.identification.prenom} ${workerData.workerInfo.identification.nom}`);
    console.log(`   - Date of birth: ${workerData.workerInfo.identification.dateNaissance}`);
    console.log(`   - Entry date: ${workerData.workerInfo.contractData.dateEntree}`);
    console.log(`   - Dimona periods: ${workerData.workerInfo.dimonaPeriods.length}`);
    console.log(`   - Protected worker periods: ${workerData.workerInfo.protectedWorker.length}`);
    console.log(`   - Contracts: ${workerData.workerInfo.contracts.length}\n`);

    // Verify the file was created
    expect(fs.existsSync(outputFile)).toBeTruthy();
  });
});
